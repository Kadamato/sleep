use anchor_lang::prelude::*;

#[derive(AnchorDeserialize, AnchorSerialize, Clone)]
pub struct TokenConfig {
    pub name: String,
    pub symbol: String,
    pub uri: String,
}
