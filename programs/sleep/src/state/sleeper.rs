use anchor_lang::prelude::*;

#[account]
#[derive(InitSpace)]
pub struct Sleeper {
    pub sleeper_key: Pubkey,
    #[max_len(100)]
    pub name: String,
    pub start_time: u64,
    pub end_time: u64,
    pub streak: u16,
}
