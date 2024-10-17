use anchor_lang::prelude::*;
use anchor_spl::{
    token_2022::MintTo,
    token_interface::{self, Mint, Token2022, TokenAccount},
};

#[derive(Accounts)]
pub struct MintToken<'info> {
    #[account(mut)]
    pub payer: Signer<'info>,

    #[account(mut)]
    pub mint: InterfaceAccount<'info, Mint>,

    #[account(mut)]
    pub receiver: InterfaceAccount<'info, TokenAccount>,

    pub token_program: Program<'info, Token2022>,
}

pub fn mint_token(ctx: Context<MintToken>, amount: u64) -> Result<()> {
    let cpi_accounts = MintTo {
        mint: ctx.accounts.mint.to_account_info().clone(),
        to: ctx.accounts.receiver.to_account_info().clone(),
        authority: ctx.accounts.payer.to_account_info(),
    };
    let cpi_program = ctx.accounts.token_program.to_account_info();
    let cpi_context = CpiContext::new(cpi_program, cpi_accounts);
    token_interface::mint_to(cpi_context, amount)?;

    msg!("Mint Token");

    

    Ok(())
}
