var board = [];
var score = 0;
var hasConflicted = new Array();

$(document).ready(function(){
	newgame();
});

function newgame() {
	//初始化棋盘格子
	init();
	//随机在两个格子里生成数字
	generateOneNumber();
	generateOneNumber();
}

function init() {
	for (let i = 0; i < 4; i++) {
		hasConflicted[i] = new Array;
		for (let j = 0; j < 4; j++) {
			hasConflicted[i][j] = false;
			$("#grid-container").append('<div class="grid-cell" id ="grid-cell-' + i + '-' + j +'"></div>');
			let gridCell = $("#grid-cell-"+i+"-"+j);
			gridCell.css('top', getPosTop(i,j));
			gridCell.css('left', getPosLeft(i,j));
		}
	}
//把board变为二维数组
	for (let i = 0; i < 4; i++) {
		board[i] = new Array(4).fill(0);
	} 
	updateBoardView();
}

function updateBoardView() {
	$(".number-cell").remove();
	for (let i = 0; i < 4; i++) {
		for (let j = 0; j < 4; j++) {
			$("#grid-container").append('<div class="number-cell" id ="number-cell-'+i+'-'+j+'"></div>');
			let theNumberCell = $('#number-cell-'+i+'-'+j);
			if (board[i][j] === 0) {
				theNumberCell.css('width', '0px');
				theNumberCell.css('height', '0px');
				theNumberCell.css('top', getPosTop(i,j)+50);
				theNumberCell.css('left', getPosLeft(i, j)+50);				
			} else {
				theNumberCell.css('width', '100px');
				theNumberCell.css('height', '100px');
				theNumberCell.css('top', getPosTop(i,j));
				theNumberCell.css('left', getPosLeft(i,j));	
				theNumberCell.css('background-color',getNumberBackgroundColor(board[i][j]));
				theNumberCell.css('color', getNumberColor(board[i][j]));
				theNumberCell.text(board[i][j]);
			}
			hasConflicted[i][j] = false;
		}
	}
}

function generateOneNumber() {
	if(nospace(board)) return false;
	//随机一个位置
	let randx = parseInt(Math.floor(Math.random() * 4));
	let randy = parseInt(Math.floor(Math.random() * 4));
	while(true) {
		if (board[randx][randy] === 0) break;
		 randx = parseInt(Math.floor(Math.random() * 4));
		 randy = parseInt(Math.floor(Math.random() * 4));
	}
	//随机一个数字
	let randNumber = Math.random() > 0.5? 2 : 4; 
	//往位置里加数字
	board[randx][randy] = randNumber;
	showNumberWithAnimation(randx,randy,randNumber);
	return true;
}

$(document).keydown(function(event) {
	switch(event.keyCode) {
	 case 37: if(moveLeft()){
			setTimeout("generateOneNumber()",210);
			setTimeout("isgameover()",300);
		}
		break;
	 case 39: if(moveRight()){
			setTimeout("generateOneNumber()",210);
			setTimeout("isgameover()",300);
		}
		break;
	 case 38: if(moveUp()){
			setTimeout("generateOneNumber()",210);
			setTimeout("isgameover()",300);
		}
		break;
	 case 40: if(moveDown()){
			setTimeout("generateOneNumber()",210);
			setTimeout("isgameover()",300);
		}
		break;
	default:
		break;

	}
});

function isgameover(){
	if(nospace(board) && nomove(board)) 
	gameover();
}

function gameover(){
	alert('Gameover!');
}

function moveLeft() {
	if(!canMoveLeft(board)) return false;
	for(let i = 0; i < 4; i++) {
		for(let j = 1; j < 4; j++) {
			if (board[i][j] !== 0) {

				for(let k = 0; k < j; k++) {
					if(board[i][k] === 0 && noBlockHorizontal(i, k, j, board)) {
						//move
						showMoveAnimation(i, j, i, k);
						board[i][k] = board[i][j];
						board[i][j] = 0;
						continue;
					} else if(board[i][k] === board[i][j] && noBlockHorizontal(i, k, j, board) && !hasConflicted[i][k]) {
						hasConflicted[i][j] = true;
						//move
						showMoveAnimation(i, j ,i ,k);
						board[i][j] = 0;
						//add
						board[i][k] *= 2;
						score += board[i][k];
						updateScore(score);
						hasConflicted[i][k] = true;
						continue;
					} 
				}				
			}		
		}
	}
	setTimeout("updateBoardView()",200); 
	return true;
}

function moveRight() {
	if(!canMoveRight(board)) return false;
	for(let i = 0; i < 4; i++) {
		for(let j = 3; j >= 0; j--) {
			if (board[i][j] !== 0) {

				for(let k = 3; k > j; k--) {
					if(board[i][k] === 0 && noBlockHorizontal(i, j, k, board)) {
						//move
						showMoveAnimation(i, j, i, k);
						board[i][k] = board[i][j];
						board[i][j] = 0;
						continue;
					} else if(board[i][k] === board[i][j] && noBlockHorizontal(i, j, k, board)&& !hasConflicted[i][k]) {
						//move
						showMoveAnimation(i, j ,i ,k);
						board[i][j] = 0;
						//add
						board[i][k] *= 2;
						//add score
						score += board[i][k];
						updateScore(score);
						hasConflicted[i][k] = true;
						continue;
					} 
				}				
			}		
		}
	}
	setTimeout("updateBoardView()",200); 
	return true;
}

function moveUp() {
	if(!canMoveUp(board)) return false;
	for(let j = 0; j < 4; j++) {
		for(let i = 1; i < 4; i++) {
			if (board[i][j] !== 0) {

				for(let k = 0; k < i; k++) {
					if(board[k][j] === 0 && noBlockVertical(k, i, j, board)) {
						//move
						showMoveAnimation(i, j, k, j);
						board[k][j] = board[i][j];
						board[i][j] = 0;
						continue;
					} else if(board[k][j] === board[i][j] && noBlockVertical(k, i, j, board) && !hasConflicted[k][j]) {
						//move
						showMoveAnimation(i, j ,k ,j);
						board[i][j] = 0;
						//add
						board[k][j] *= 2;
						score += board[k][j];
						updateScore(score);
						hasConflicted[k][j] = true;
						continue;
					} 
				}				
			}		
		}
	}
	setTimeout("updateBoardView()",200); 
	return true;
}

function moveDown() {
	if(!canMoveDown(board)) return false;
	for(let j = 0; j < 4; j++) {
		for(let i = 3; i >=0; i--) {
			if (board[i][j] !== 0) {

				for(let k = 3; k > i; k--) {
					if(board[k][j] === 0 && noBlockVertical(i, k, j, board)) {
						//move
						showMoveAnimation(i, j, k, j);
						board[k][j] = board[i][j];
						board[i][j] = 0;
						continue;
					} else if(board[k][j] === board[i][j] && noBlockVertical(i, k, j, board) && !hasConflicted[k][j]) {
						//move
						showMoveAnimation(i, j ,k ,j);
						board[i][j] = 0;
						//add
						board[k][j] *= 2;
						score += board[k][j];
						updateScore(score);
						hasConflicted[k][j] = true;
						continue;
					} 
				}				
			}		
		}
	}
	setTimeout("updateBoardView()",200); 
	return true;
}

