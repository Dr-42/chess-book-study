// Prevents additional console window on Windows in release, DO NOT REMOVE!!
#![cfg_attr(not(debug_assertions), windows_subsystem = "windows")]
use chess::{Board, BoardStatus, ChessMove, MoveGen};
use std::str::FromStr;

#[tauri::command]
fn get_attack_squares(fen: String, square: String) -> Vec<String> {
    let board = Board::from_str(&fen).unwrap();
    let moves = MoveGen::new_legal(&board);
    let mut attack_squares = Vec::new();
    let square = chess::Square::from_str(&square).unwrap();
    for m in moves {
        if m.get_source() == square {
            attack_squares.push(m.get_dest().to_string());
        }
    }
    //println!("{:?} {:?}", fen, square);
    //println!("{:?}", attack_squares);
    attack_squares
}

#[tauri::command]
fn check_board_state(fen: String) -> String {
    let board = Board::from_str(&fen).unwrap();
    let board_state = board.status();
    if board_state == BoardStatus::Checkmate {
        return "checkmate".to_string();
    } else if board_state == BoardStatus::Stalemate {
        return "stalemate".to_string();
    }

    let new_board = board.null_move();
    if new_board.is_none() {
        return "check".to_string();
    }
    "continue".to_string()
}

#[tauri::command]
fn get_king_square(fen: String, color: String) -> String {
    let board = Board::from_str(&fen).unwrap();
    let col: chess::Color;
    if color == "white" {
        col = chess::Color::White;
    } else {
        col = chess::Color::Black;
    }
    let king_square = board.king_square(col);
    king_square.to_string()
}

#[tauri::command]
fn move_piece(fen: String, from: String, to: String, promotion: Option<String>) -> String {
    let board = Board::from_str(&fen).unwrap();
    let from = chess::Square::from_str(&from).unwrap();
    let to = chess::Square::from_str(&to).unwrap();
    let moves = MoveGen::new_legal(&board);
    let mut legal_move = false;
    let mut mov: ChessMove = ChessMove::new(from, to, None);
    for m in moves {
        if m.get_source() == from && m.get_dest() == to {
            legal_move = true;
            mov = m;
        }
    }
    if legal_move {
        if promotion.is_some() {
            let promotion = promotion.unwrap();
            let promotion = match promotion.as_str() {
                "q" => chess::Piece::Queen,
                "r" => chess::Piece::Rook,
                "b" => chess::Piece::Bishop,
                "n" => chess::Piece::Knight,
                _ => chess::Piece::Queen,
            };
            mov = ChessMove::new(from, to, Some(promotion));
        }
        let new_board = board.make_move_new(mov);
        return new_board.to_string();
    } else {
        return "illegal".to_string();
    }
}

fn main() {
    tauri::Builder::default()
        .invoke_handler(tauri::generate_handler![
            get_attack_squares,
            check_board_state,
            move_piece,
            get_king_square
        ])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
