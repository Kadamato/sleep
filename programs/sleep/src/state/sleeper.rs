use anchor_lang::prelude::*;

#[account]
#[derive(InitSpace)]
pub struct Sleeper {
    pub sleeper_key: Pubkey,
    pub token_account: Pubkey,
    pub start_time: u64,
    pub end_time: u64,
    pub streak: u16,
}
