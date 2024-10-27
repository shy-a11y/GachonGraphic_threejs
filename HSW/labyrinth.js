// 미로 크기 설정
var dH = 15;
var dW = 28;
var scaleFactor = 1/20; // 1/20로 축소

var lab = [];
var L = [];
var R = [];
var X;
var Y;

// 미로의 초기 상태 설정
function generateLabyrinth() {
	// 미로 초기화
	for (var x = 0; x < 2 * dW; x++) {
		lab[x] = [];
		for (var y = 0; y < 2 * dH; y++)
			lab[x][y] = false;
	}

	// 미로 경로 생성
	X = 0;
	Y = 0;
	L[0] = 1;
	var E = dW;
	while (E) {
		L[E] = E;
		R[E] = E;
		E--;
		if (E) {
			plotH(); // 가로 벽 생성
		}
		X += 2;
	}
	plotN(); // 다음 행으로 이동
	plotV0(); // 첫 세로 경로 생성
	// 추가 미로 생성
	var H = dH;
	while (H > 1) {
		H--;
		var C = dW;
		while (C > 1) {
			C--;
			E = L[C - 1];
			if ((C != E) && (Math.random() > 0.5)) {
				// 경로 연결
				R[E] = R[C];
				L[R[C]] = E;
				R[C] = C - 1;
				L[C - 1] = C;
			} else {
				plotV(); // 세로 벽 생성
			}
			E = L[C];
			if ((C != E) && (Math.random() > 0.5)) {
				R[E] = R[C];
				L[R[C]] = E;
				L[C] = C;
				R[C] = C;
				plotH(); // 가로 벽 생성
			}
			X = X + 2;
		}
		plotN();
		plotV0();
	}
}

// 벽이 있는지 확인하는 함수
function isWall(x, y) {
	return lab[x] && lab[x][y];
}

// 벽을 생성하는 도우미 함수들
function plotV0() {
	lab[X][Y] = true;
	lab[X][Y + 1] = true;
	X++;
}

function plotV() {
	lab[X + 1][Y] = true;
	lab[X + 1][Y + 1] = true;
}

function plotH() {
	lab[X][Y + 1] = true;
	lab[X + 1][Y + 1] = true;
}

function plotN() {
	X = 0;
	Y = Y + 2;
}
