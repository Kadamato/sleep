use anchor_lang::prelude::*;

pub mod error;
pub mod instructions;
pub mod state;
pub mod utils;

pub use instructions::*;
pub use state::*;

declare_id!("13go66PaZfF5vMYAKhvq5tRbcAmcEEiS8eLeqJnwkokF");

#[program]
pub mod sleep {

    use super::*;

    pub fn initialize_token(ctx: Context<InitToken>, args: TokenConfig) -> Result<()> {
        let _ = mint(ctx, args);
        Ok(())
    }

    pub fn create_new_sleeper(ctx: Context<InitSleeper>) -> Result<()> {
        let _ = create_sleeper(ctx);
        Ok(())
    }

    // pub fn mint_token_to(ctx: Context<MintToken>, amount: u64) -> Result<()> {
    //     let _ = mint_token(ctx, amount);
    //     Ok(())
    // }

    pub fn start_sleep(ctx: Context<Sleep>, time: u64) -> Result<()> {
        let _ = sleep(ctx, time);
        Ok(())
    }

    pub fn claim(ctx: Context<Claim>, end_time: u64) -> Result<()> {
        let _ = claim_token(ctx, end_time);
        Ok(())
    }
}

#[derive(Accounts)]
pub struct Initialize {}
