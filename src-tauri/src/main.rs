// Prevents additional console window on Windows in release, DO NOT REMOVE!!
#![cfg_attr(not(debug_assertions), windows_subsystem = "windows")]
use chess::{Board, BoardStatus, ChessMove, MoveGen, Piece, Square};
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
    let mut mov = ChessMove::new(from, to, None);
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
}

#[tauri::command]
fn get_san_move(
    fen: String,
    to: String,
    from: String,
    promotion: Option<String>,
    move_num: i32,
    is_white: bool,
) -> String {
    let mut result: String;
    if is_white {
        result = format!("{}.", move_num);
    } else {
        result = "".to_string();
    }
    let board = Board::from_str(&fen).unwrap();
    let from = chess::Square::from_str(&from).unwrap();
    let to = chess::Square::from_str(&to).unwrap();
    let mov: ChessMove;
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
    } else {
        mov = ChessMove::new(from, to, None);
    }
    let moves = MoveGen::new_legal(&board);
    let piece = board.piece_on(from);
    let mut dup_source: Option<Square> = None;
    let mut double_dup = false;
    for m in moves {
        if m.get_dest() == mov.get_dest() && m.get_source() != mov.get_source() {
            if board.piece_on(m.get_source()) == piece {
                if dup_source.is_some() {
                    double_dup = true;
                }
                dup_source = Some(m.get_source());
            }
        }
    }

    let piece_letter: &str = match piece.unwrap() {
        Piece::Pawn => "",
        Piece::Knight => "N",
        Piece::Bishop => "B",
        Piece::Rook => "R",
        Piece::Queen => "Q",
        Piece::King => "K",
    };
    result.push_str(piece_letter);

    if dup_source.is_some() && !double_dup {
        if dup_source.unwrap().get_file() == from.get_file() {
            let rank = from.get_rank();
            let rank_str = match rank {
                chess::Rank::First => "1",
                chess::Rank::Second => "2",
                chess::Rank::Third => "3",
                chess::Rank::Fourth => "4",
                chess::Rank::Fifth => "5",
                chess::Rank::Sixth => "6",
                chess::Rank::Seventh => "7",
                chess::Rank::Eighth => "8",
            };
            result.push_str(&rank_str);
        } else {
            let file = from.get_file();
            let file_str = match file {
                chess::File::A => "a",
                chess::File::B => "b",
                chess::File::C => "c",
                chess::File::D => "d",
                chess::File::E => "e",
                chess::File::F => "f",
                chess::File::G => "g",
                chess::File::H => "h",
            };
            result.push_str(&file_str);
        }
    }
    if double_dup {
        result.push_str(&from.to_string());
    }
    if board.piece_on(mov.get_dest()).is_some() {
        if piece.unwrap() == Piece::Pawn {
            let file = from.get_file();
            let file_str = match file {
                chess::File::A => "a",
                chess::File::B => "b",
                chess::File::C => "c",
                chess::File::D => "d",
                chess::File::E => "e",
                chess::File::F => "f",
                chess::File::G => "g",
                chess::File::H => "h",
            };
            result.push_str(&file_str);
        }
        result.push_str("x");
    }
    result.push_str(&to.to_string());
    if mov.get_promotion().is_some() {
        let promotion = mov.get_promotion().unwrap();
        result.push_str("=");
        let promotion_letter: &str = match promotion {
            Piece::Pawn => "",
            Piece::Knight => "N",
            Piece::Bishop => "B",
            Piece::Rook => "R",
            Piece::Queen => "Q",
            Piece::King => "K",
        };
        result.push_str(promotion_letter);
    }
    if mov.get_source() == chess::Square::from_str("e1").unwrap()
        && mov.get_dest() == chess::Square::from_str("g1").unwrap()
        && board.piece_on(mov.get_source()) == Some(Piece::King)
    {
        result = format!("{}.O-O", move_num);
    } else if mov.get_source() == chess::Square::from_str("e1").unwrap()
        && mov.get_dest() == chess::Square::from_str("c1").unwrap()
        && board.piece_on(mov.get_source()) == Some(Piece::King)
    {
        result = format!("{}.O-O-O", move_num);
    } else if mov.get_source() == chess::Square::from_str("e8").unwrap()
        && mov.get_dest() == chess::Square::from_str("g8").unwrap()
        && board.piece_on(mov.get_source()) == Some(Piece::King)
    {
        result = "O-O".to_string();
    } else if mov.get_source() == chess::Square::from_str("e8").unwrap()
        && mov.get_dest() == chess::Square::from_str("c8").unwrap()
        && board.piece_on(mov.get_source()) == Some(Piece::King)
    {
        result = "O-O-O".to_string();
    }
    let new_board = board.make_move_new(mov);
    if new_board.status() == BoardStatus::Checkmate {
        result.push_str("#");
    } else if new_board.null_move().is_none() {
        result.push_str("+");
    }
    result.push_str(" ");
    result
}

#[tauri::command]
fn is_board_sane(fen: String) -> String {
    let board = Board::from_str(&fen);
    if board.is_err() {
        return board.err().unwrap().to_string();
    }
    "ok".to_string()
}

fn main() {
    tauri::Builder::default()
        .invoke_handler(tauri::generate_handler![
            get_attack_squares,
            check_board_state,
            move_piece,
            get_king_square,
            get_san_move,
            is_board_sane
        ])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
