#![cfg_attr(not(debug_assertions), windows_subsystem = "windows")]

pub mod chess_helpers;

fn main() {
    tauri::Builder::default()
        .invoke_handler(tauri::generate_handler![
            chess_helpers::get_attack_squares,
            chess_helpers::check_board_state,
            chess_helpers::move_piece,
            chess_helpers::get_king_square,
            chess_helpers::get_san_move,
            chess_helpers::is_board_sane
        ])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
