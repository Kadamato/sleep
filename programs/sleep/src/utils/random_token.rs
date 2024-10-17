use anchor_lang::prelude::*;
use solana_program::keccak::hash;

fn to_u64(bytes: &[u8]) -> u64 {
    let mut array = [0u8; 8];
    array.copy_from_slice(&bytes[0..8]);
    u64::from_le_bytes(array)
}

// Function to generate random number in range [min, max]
pub fn random_token(min: u64, max: u64) -> u64 {
    // Get the current slot number to use as a source of randomness
    let slot = Clock::get().unwrap().slot.to_be_bytes();

    // Hash the slot using Keccak-256 to generate a random-like output
    let hash_result = hash(&slot);

    // Convert the first 8 bytes of the hash to a u64 number
    let random_number = to_u64(&hash_result.to_bytes());

    // Map the random number to the desired range [min, max]
    let range = max - min + 1;
    min + (random_number % range)
}
