// Prevents additional console window on Windows in release, DO NOT REMOVE!!
#![cfg_attr(not(debug_assertions), windows_subsystem = "windows")]
use chess::{Board, MoveGen};
use std::str::FromStr;

#[tauri::command]
fn get_attack_square(fen: String, square: String) -> Vec<String> {
    let board = Board::from_str(&fen).unwrap();
    let moves = MoveGen::new_legal(&board);
    let mut attack_squares = Vec::new();
    let square = chess::Square::from_str(&square).unwrap();
    for m in moves {
        if m.get_source() == square {
            attack_squares.push(m.get_dest().to_string());
        }
    }
    attack_squares
}

fn main() {
    tauri::Builder::default()
        .invoke_handler(tauri::generate_handler![get_attack_square])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
