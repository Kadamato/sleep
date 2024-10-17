use anchor_lang::prelude::*;

#[error_code]
pub enum ClaimError {
    #[msg("Out time")]
    OutTime,
}
