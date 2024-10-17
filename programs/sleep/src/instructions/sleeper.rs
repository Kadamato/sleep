use anchor_lang::prelude::*;

use crate::state::Sleeper;

const NAME_LENGTH: usize = 100;

#[derive(Accounts)]
pub struct InitSleeper<'info> {
    #[account(mut)]
    pub payer: Signer<'info>,

    #[account(
        init,
        payer = payer,
        space = 8 + Sleeper::INIT_SPACE,
        seeds = [b"sleeper_account".as_ref(), payer.key().as_ref()],
        bump
    )]
    pub sleeper_account: Account<'info, Sleeper>,

    pub system_program: Program<'info, System>,
    pub rent: Sysvar<'info, Rent>,
}

pub fn create_sleeper(ctx: Context<InitSleeper>, name: String) -> Result<()> {
    require!(name.len() <= NAME_LENGTH, SleeperError::InvalidName);

    let sleeper_account = &mut ctx.accounts.sleeper_account;
    sleeper_account.name = name;
    sleeper_account.sleeper_key = ctx.accounts.payer.key();

    Ok(())
}

#[error_code]
pub enum SleeperError {
    #[msg("Name too long")]
    InvalidName,
}
