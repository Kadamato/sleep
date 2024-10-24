use anchor_lang::prelude::*;
use anchor_spl::token_interface::{Mint, Token2022, TokenAccount};

use crate::state::Sleeper;

#[derive(Accounts)]
pub struct InitSleeper<'info> {
    #[account(
        init_if_needed,
        payer = payer,
        space = 8 + Sleeper::INIT_SPACE,
        seeds = [b"sleeper_account".as_ref(), payer.key().as_ref()],
        bump
    )]
    pub sleeper_account: Account<'info, Sleeper>,

    #[account(
        init,
        payer = payer,
        token::mint = mint,
        token::authority = payer,
        seeds= [b"token_account".as_ref(), payer.key().as_ref(), mint.key().as_ref()],
        bump
    )]
    pub token_account: InterfaceAccount<'info, TokenAccount>,

    #[account(mut)]
    pub payer: Signer<'info>,

    pub mint: InterfaceAccount<'info, Mint>,

    pub system_program: Program<'info, System>,
    pub rent: Sysvar<'info, Rent>,
    // pub associated_token_program: Program<'info, AssociatedToken>,
    pub token_program: Program<'info, Token2022>,
}

pub fn create_sleeper(ctx: Context<InitSleeper>) -> Result<()> {
    let sleeper_account = &mut ctx.accounts.sleeper_account;
    // sleeper_account.name = name;
    sleeper_account.sleeper_key = ctx.accounts.payer.key();
    sleeper_account.token_account = ctx.accounts.token_account.key();

    Ok(())
}

#[error_code]
pub enum SleeperError {
    #[msg("Name too long")]
    InvalidName,
}
