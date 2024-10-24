use std::char::MAX;
use std::ops::Sub;
use std::time;

use anchor_lang::prelude::*;
use anchor_spl::token_2022::MintTo;
use anchor_spl::token_interface::{self, Mint, Token2022, TokenAccount};

use crate::error::ClaimError;
use crate::utils::random_token;
use crate::Sleeper;
// use crate::{MAX_TIME, MIN_TIME};

pub const MIN_TIME: u64 = 25200000;
pub const MAX_TIME: u64 = 32400000;

#[derive(Accounts)]

pub struct Claim<'info> {
    #[account(mut)]
    pub payer: Signer<'info>,

    #[account(mut)]
    pub mint: InterfaceAccount<'info, Mint>,

    #[account(mut)]
    pub sleeper_account: Account<'info, Sleeper>,

    #[account(mut)]
    pub token_account: InterfaceAccount<'info, TokenAccount>,

    pub token_program: Program<'info, Token2022>,
}

pub fn claim_token(ctx: Context<Claim>, end_time: u64) -> Result<()> {
    let sleeper_account = &mut ctx.accounts.sleeper_account;
    sleeper_account.end_time = end_time;

    let start_time = sleeper_account.start_time;

    let time_difference = end_time.saturating_sub(start_time);

    msg!("{}", time_difference >= MIN_TIME);
    msg!("{}", time_difference <= MAX_TIME);

    require!(
        time_difference >= MIN_TIME && time_difference <= MAX_TIME,
        ClaimError::OutTime
    );

    sleeper_account.streak += 1;

    //     random 5 - 25 sl token

    let amount: u64 = random_token(5, 25);

    //     mint token
    let cpi_accounts = MintTo {
        mint: ctx.accounts.mint.to_account_info().clone(),
        to: ctx.accounts.token_account.to_account_info().clone(),
        authority: ctx.accounts.payer.to_account_info(),
    };

    let cpi_program = ctx.accounts.token_program.to_account_info();
    let cpi_context = CpiContext::new(cpi_program, cpi_accounts);
    token_interface::mint_to(cpi_context, amount * 1000000)?;

    //  reset time

    sleeper_account.start_time = 0;
    sleeper_account.end_time = 0;

    msg!("Great, you have a good night sleep ");

    Ok(())
}
