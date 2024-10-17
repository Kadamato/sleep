use anchor_lang::prelude::*;

use crate::Sleeper;

#[derive(Accounts)]
pub struct Sleep<'info> {
    #[account(mut)]
    pub payer: Signer<'info>,
    #[account(mut)]
    pub sleeper: Account<'info, Sleeper>,
}

pub fn sleep(ctx: Context<Sleep>, start_time: u64) -> Result<()> {
    let sleeper_account = &mut ctx.accounts.sleeper;
    sleeper_account.start_time = start_time;

    msg!("Sleeping...");
    Ok(())
}
