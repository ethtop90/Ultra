pragma circom 2.1.5;

include "@zk-email/zk-regex-circom/circuits/regex_helpers.circom";

template GarantiPaymentDetailsRegex(msg_bytes) {
	signal input msg[msg_bytes];
	signal output out;

	var num_bytes = msg_bytes+1;
	signal in[num_bytes];
	in[0]<==255;
	for (var i = 0; i < msg_bytes; i++) {
		in[i+1] <== msg[i];
	}

	component eq[32][num_bytes];
	component lt[4][num_bytes];
	component and[91][num_bytes];
	component multi_or[6][num_bytes];
	signal states[num_bytes+1][87];
	component state_changed[num_bytes];

	states[0][0] <== 1;
	for (var i = 1; i < 87; i++) {
		states[0][i] <== 0;
	}

	for (var i = 0; i < num_bytes; i++) {
		state_changed[i] = MultiOR(86);
		lt[0][i] = LessEqThan(8);
		lt[0][i].in[0] <== 0;
		lt[0][i].in[1] <== in[i];
		lt[1][i] = LessEqThan(8);
		lt[1][i].in[0] <== in[i];
		lt[1][i].in[1] <== 59;
		and[0][i] = AND();
		and[0][i].a <== lt[0][i].out;
		and[0][i].b <== lt[1][i].out;
		lt[2][i] = LessEqThan(8);
		lt[2][i].in[0] <== 61;
		lt[2][i].in[1] <== in[i];
		lt[3][i] = LessEqThan(8);
		lt[3][i].in[0] <== in[i];
		lt[3][i].in[1] <== 254;
		and[1][i] = AND();
		and[1][i].a <== lt[2][i].out;
		and[1][i].b <== lt[3][i].out;
		and[2][i] = AND();
		and[2][i].a <== states[i][1];
		multi_or[0][i] = MultiOR(2);
		multi_or[0][i].in[0] <== and[0][i].out;
		multi_or[0][i].in[1] <== and[1][i].out;
		and[2][i].b <== multi_or[0][i].out;
		and[3][i] = AND();
		and[3][i].a <== states[i][9];
		and[3][i].b <== multi_or[0][i].out;
		multi_or[1][i] = MultiOR(2);
		multi_or[1][i].in[0] <== and[2][i].out;
		multi_or[1][i].in[1] <== and[3][i].out;
		states[i+1][1] <== multi_or[1][i].out;
		state_changed[i].in[0] <== states[i+1][1];
		eq[0][i] = IsEqual();
		eq[0][i].in[0] <== in[i];
		eq[0][i].in[1] <== 60;
		and[4][i] = AND();
		and[4][i].a <== states[i][0];
		and[4][i].b <== eq[0][i].out;
		states[i+1][2] <== and[4][i].out;
		state_changed[i].in[1] <== states[i+1][2];
		eq[1][i] = IsEqual();
		eq[1][i].in[0] <== in[i];
		eq[1][i].in[1] <== 115;
		and[5][i] = AND();
		and[5][i].a <== states[i][2];
		and[5][i].b <== eq[1][i].out;
		states[i+1][3] <== and[5][i].out;
		state_changed[i].in[2] <== states[i+1][3];
		eq[2][i] = IsEqual();
		eq[2][i].in[0] <== in[i];
		eq[2][i].in[1] <== 116;
		and[6][i] = AND();
		and[6][i].a <== states[i][3];
		and[6][i].b <== eq[2][i].out;
		states[i+1][4] <== and[6][i].out;
		state_changed[i].in[3] <== states[i+1][4];
		eq[3][i] = IsEqual();
		eq[3][i].in[0] <== in[i];
		eq[3][i].in[1] <== 114;
		and[7][i] = AND();
		and[7][i].a <== states[i][4];
		and[7][i].b <== eq[3][i].out;
		states[i+1][5] <== and[7][i].out;
		state_changed[i].in[4] <== states[i+1][5];
		eq[4][i] = IsEqual();
		eq[4][i].in[0] <== in[i];
		eq[4][i].in[1] <== 111;
		and[8][i] = AND();
		and[8][i].a <== states[i][5];
		and[8][i].b <== eq[4][i].out;
		states[i+1][6] <== and[8][i].out;
		state_changed[i].in[5] <== states[i+1][6];
		eq[5][i] = IsEqual();
		eq[5][i].in[0] <== in[i];
		eq[5][i].in[1] <== 110;
		and[9][i] = AND();
		and[9][i].a <== states[i][6];
		and[9][i].b <== eq[5][i].out;
		states[i+1][7] <== and[9][i].out;
		state_changed[i].in[6] <== states[i+1][7];
		eq[6][i] = IsEqual();
		eq[6][i].in[0] <== in[i];
		eq[6][i].in[1] <== 103;
		and[10][i] = AND();
		and[10][i].a <== states[i][7];
		and[10][i].b <== eq[6][i].out;
		states[i+1][8] <== and[10][i].out;
		state_changed[i].in[7] <== states[i+1][8];
		eq[7][i] = IsEqual();
		eq[7][i].in[0] <== in[i];
		eq[7][i].in[1] <== 62;
		and[11][i] = AND();
		and[11][i].a <== states[i][8];
		and[11][i].b <== eq[7][i].out;
		states[i+1][9] <== and[11][i].out;
		state_changed[i].in[8] <== states[i+1][9];
		and[12][i] = AND();
		and[12][i].a <== states[i][1];
		and[12][i].b <== eq[0][i].out;
		states[i+1][10] <== and[12][i].out;
		state_changed[i].in[9] <== states[i+1][10];
		eq[8][i] = IsEqual();
		eq[8][i].in[0] <== in[i];
		eq[8][i].in[1] <== 98;
		and[13][i] = AND();
		and[13][i].a <== states[i][10];
		and[13][i].b <== eq[8][i].out;
		states[i+1][11] <== and[13][i].out;
		state_changed[i].in[10] <== states[i+1][11];
		and[14][i] = AND();
		and[14][i].a <== states[i][11];
		and[14][i].b <== eq[3][i].out;
		states[i+1][12] <== and[14][i].out;
		state_changed[i].in[11] <== states[i+1][12];
		and[15][i] = AND();
		and[15][i].a <== states[i][12];
		and[15][i].b <== eq[7][i].out;
		states[i+1][13] <== and[15][i].out;
		state_changed[i].in[12] <== states[i+1][13];
		eq[9][i] = IsEqual();
		eq[9][i].in[0] <== in[i];
		eq[9][i].in[1] <== 84;
		and[16][i] = AND();
		and[16][i].a <== states[i][13];
		and[16][i].b <== eq[9][i].out;
		states[i+1][14] <== and[16][i].out;
		state_changed[i].in[13] <== states[i+1][14];
		eq[10][i] = IsEqual();
		eq[10][i].in[0] <== in[i];
		eq[10][i].in[1] <== 82;
		and[17][i] = AND();
		and[17][i].a <== states[i][14];
		and[17][i].b <== eq[10][i].out;
		states[i+1][15] <== and[17][i].out;
		state_changed[i].in[14] <== states[i+1][15];
		eq[11][i] = IsEqual();
		eq[11][i].in[0] <== in[i];
		eq[11][i].in[1] <== 32;
		eq[12][i] = IsEqual();
		eq[12][i].in[0] <== in[i];
		eq[12][i].in[1] <== 48;
		eq[13][i] = IsEqual();
		eq[13][i].in[0] <== in[i];
		eq[13][i].in[1] <== 49;
		eq[14][i] = IsEqual();
		eq[14][i].in[0] <== in[i];
		eq[14][i].in[1] <== 50;
		eq[15][i] = IsEqual();
		eq[15][i].in[0] <== in[i];
		eq[15][i].in[1] <== 51;
		eq[16][i] = IsEqual();
		eq[16][i].in[0] <== in[i];
		eq[16][i].in[1] <== 52;
		eq[17][i] = IsEqual();
		eq[17][i].in[0] <== in[i];
		eq[17][i].in[1] <== 53;
		eq[18][i] = IsEqual();
		eq[18][i].in[0] <== in[i];
		eq[18][i].in[1] <== 54;
		eq[19][i] = IsEqual();
		eq[19][i].in[0] <== in[i];
		eq[19][i].in[1] <== 55;
		eq[20][i] = IsEqual();
		eq[20][i].in[0] <== in[i];
		eq[20][i].in[1] <== 56;
		eq[21][i] = IsEqual();
		eq[21][i].in[0] <== in[i];
		eq[21][i].in[1] <== 57;
		and[18][i] = AND();
		and[18][i].a <== states[i][15];
		multi_or[2][i] = MultiOR(11);
		multi_or[2][i].in[0] <== eq[11][i].out;
		multi_or[2][i].in[1] <== eq[12][i].out;
		multi_or[2][i].in[2] <== eq[13][i].out;
		multi_or[2][i].in[3] <== eq[14][i].out;
		multi_or[2][i].in[4] <== eq[15][i].out;
		multi_or[2][i].in[5] <== eq[16][i].out;
		multi_or[2][i].in[6] <== eq[17][i].out;
		multi_or[2][i].in[7] <== eq[18][i].out;
		multi_or[2][i].in[8] <== eq[19][i].out;
		multi_or[2][i].in[9] <== eq[20][i].out;
		multi_or[2][i].in[10] <== eq[21][i].out;
		and[18][i].b <== multi_or[2][i].out;
		and[19][i] = AND();
		and[19][i].a <== states[i][16];
		and[19][i].b <== multi_or[2][i].out;
		multi_or[3][i] = MultiOR(2);
		multi_or[3][i].in[0] <== and[18][i].out;
		multi_or[3][i].in[1] <== and[19][i].out;
		states[i+1][16] <== multi_or[3][i].out;
		state_changed[i].in[15] <== states[i+1][16];
		and[20][i] = AND();
		and[20][i].a <== states[i][16];
		and[20][i].b <== eq[0][i].out;
		states[i+1][17] <== and[20][i].out;
		state_changed[i].in[16] <== states[i+1][17];
		eq[22][i] = IsEqual();
		eq[22][i].in[0] <== in[i];
		eq[22][i].in[1] <== 47;
		and[21][i] = AND();
		and[21][i].a <== states[i][17];
		and[21][i].b <== eq[22][i].out;
		states[i+1][18] <== and[21][i].out;
		state_changed[i].in[17] <== states[i+1][18];
		and[22][i] = AND();
		and[22][i].a <== states[i][18];
		and[22][i].b <== eq[1][i].out;
		states[i+1][19] <== and[22][i].out;
		state_changed[i].in[18] <== states[i+1][19];
		and[23][i] = AND();
		and[23][i].a <== states[i][19];
		and[23][i].b <== eq[2][i].out;
		states[i+1][20] <== and[23][i].out;
		state_changed[i].in[19] <== states[i+1][20];
		and[24][i] = AND();
		and[24][i].a <== states[i][20];
		and[24][i].b <== eq[3][i].out;
		states[i+1][21] <== and[24][i].out;
		state_changed[i].in[20] <== states[i+1][21];
		and[25][i] = AND();
		and[25][i].a <== states[i][21];
		and[25][i].b <== eq[4][i].out;
		states[i+1][22] <== and[25][i].out;
		state_changed[i].in[21] <== states[i+1][22];
		and[26][i] = AND();
		and[26][i].a <== states[i][22];
		and[26][i].b <== eq[5][i].out;
		states[i+1][23] <== and[26][i].out;
		state_changed[i].in[22] <== states[i+1][23];
		and[27][i] = AND();
		and[27][i].a <== states[i][23];
		and[27][i].b <== eq[6][i].out;
		states[i+1][24] <== and[27][i].out;
		state_changed[i].in[23] <== states[i+1][24];
		and[28][i] = AND();
		and[28][i].a <== states[i][24];
		and[28][i].b <== eq[7][i].out;
		states[i+1][25] <== and[28][i].out;
		state_changed[i].in[24] <== states[i+1][25];
		and[29][i] = AND();
		and[29][i].a <== states[i][25];
		and[29][i].b <== eq[0][i].out;
		states[i+1][26] <== and[29][i].out;
		state_changed[i].in[25] <== states[i+1][26];
		and[30][i] = AND();
		and[30][i].a <== states[i][26];
		and[30][i].b <== eq[22][i].out;
		states[i+1][27] <== and[30][i].out;
		state_changed[i].in[26] <== states[i+1][27];
		eq[23][i] = IsEqual();
		eq[23][i].in[0] <== in[i];
		eq[23][i].in[1] <== 112;
		and[31][i] = AND();
		and[31][i].a <== states[i][27];
		and[31][i].b <== eq[23][i].out;
		states[i+1][28] <== and[31][i].out;
		state_changed[i].in[27] <== states[i+1][28];
		and[32][i] = AND();
		and[32][i].a <== states[i][28];
		and[32][i].b <== eq[7][i].out;
		states[i+1][29] <== and[32][i].out;
		state_changed[i].in[28] <== states[i+1][29];
		eq[24][i] = IsEqual();
		eq[24][i].in[0] <== in[i];
		eq[24][i].in[1] <== 13;
		and[33][i] = AND();
		and[33][i].a <== states[i][29];
		and[33][i].b <== eq[24][i].out;
		states[i+1][30] <== and[33][i].out;
		state_changed[i].in[29] <== states[i+1][30];
		eq[25][i] = IsEqual();
		eq[25][i].in[0] <== in[i];
		eq[25][i].in[1] <== 10;
		and[34][i] = AND();
		and[34][i].a <== states[i][30];
		and[34][i].b <== eq[25][i].out;
		states[i+1][31] <== and[34][i].out;
		state_changed[i].in[30] <== states[i+1][31];
		and[35][i] = AND();
		and[35][i].a <== states[i][31];
		and[35][i].b <== eq[11][i].out;
		states[i+1][32] <== and[35][i].out;
		state_changed[i].in[31] <== states[i+1][32];
		and[36][i] = AND();
		and[36][i].a <== states[i][32];
		and[36][i].b <== eq[11][i].out;
		states[i+1][33] <== and[36][i].out;
		state_changed[i].in[32] <== states[i+1][33];
		and[37][i] = AND();
		and[37][i].a <== states[i][33];
		and[37][i].b <== eq[11][i].out;
		states[i+1][34] <== and[37][i].out;
		state_changed[i].in[33] <== states[i+1][34];
		and[38][i] = AND();
		and[38][i].a <== states[i][34];
		and[38][i].b <== eq[11][i].out;
		states[i+1][35] <== and[38][i].out;
		state_changed[i].in[34] <== states[i+1][35];
		and[39][i] = AND();
		and[39][i].a <== states[i][35];
		and[39][i].b <== eq[11][i].out;
		states[i+1][36] <== and[39][i].out;
		state_changed[i].in[35] <== states[i+1][36];
		and[40][i] = AND();
		and[40][i].a <== states[i][36];
		and[40][i].b <== eq[11][i].out;
		states[i+1][37] <== and[40][i].out;
		state_changed[i].in[36] <== states[i+1][37];
		and[41][i] = AND();
		and[41][i].a <== states[i][37];
		and[41][i].b <== eq[11][i].out;
		states[i+1][38] <== and[41][i].out;
		state_changed[i].in[37] <== states[i+1][38];
		and[42][i] = AND();
		and[42][i].a <== states[i][38];
		and[42][i].b <== eq[11][i].out;
		states[i+1][39] <== and[42][i].out;
		state_changed[i].in[38] <== states[i+1][39];
		and[43][i] = AND();
		and[43][i].a <== states[i][39];
		and[43][i].b <== eq[11][i].out;
		states[i+1][40] <== and[43][i].out;
		state_changed[i].in[39] <== states[i+1][40];
		and[44][i] = AND();
		and[44][i].a <== states[i][40];
		and[44][i].b <== eq[11][i].out;
		states[i+1][41] <== and[44][i].out;
		state_changed[i].in[40] <== states[i+1][41];
		and[45][i] = AND();
		and[45][i].a <== states[i][41];
		and[45][i].b <== eq[11][i].out;
		states[i+1][42] <== and[45][i].out;
		state_changed[i].in[41] <== states[i+1][42];
		and[46][i] = AND();
		and[46][i].a <== states[i][42];
		and[46][i].b <== eq[11][i].out;
		states[i+1][43] <== and[46][i].out;
		state_changed[i].in[42] <== states[i+1][43];
		and[47][i] = AND();
		and[47][i].a <== states[i][43];
		and[47][i].b <== eq[11][i].out;
		states[i+1][44] <== and[47][i].out;
		state_changed[i].in[43] <== states[i+1][44];
		and[48][i] = AND();
		and[48][i].a <== states[i][44];
		and[48][i].b <== eq[11][i].out;
		states[i+1][45] <== and[48][i].out;
		state_changed[i].in[44] <== states[i+1][45];
		and[49][i] = AND();
		and[49][i].a <== states[i][45];
		and[49][i].b <== eq[11][i].out;
		states[i+1][46] <== and[49][i].out;
		state_changed[i].in[45] <== states[i+1][46];
		and[50][i] = AND();
		and[50][i].a <== states[i][46];
		and[50][i].b <== eq[11][i].out;
		states[i+1][47] <== and[50][i].out;
		state_changed[i].in[46] <== states[i+1][47];
		and[51][i] = AND();
		and[51][i].a <== states[i][47];
		and[51][i].b <== eq[11][i].out;
		states[i+1][48] <== and[51][i].out;
		state_changed[i].in[47] <== states[i+1][48];
		and[52][i] = AND();
		and[52][i].a <== states[i][48];
		and[52][i].b <== eq[11][i].out;
		states[i+1][49] <== and[52][i].out;
		state_changed[i].in[48] <== states[i+1][49];
		and[53][i] = AND();
		and[53][i].a <== states[i][49];
		and[53][i].b <== eq[0][i].out;
		states[i+1][50] <== and[53][i].out;
		state_changed[i].in[49] <== states[i+1][50];
		and[54][i] = AND();
		and[54][i].a <== states[i][50];
		and[54][i].b <== eq[23][i].out;
		states[i+1][51] <== and[54][i].out;
		state_changed[i].in[50] <== states[i+1][51];
		and[55][i] = AND();
		and[55][i].a <== states[i][51];
		and[55][i].b <== eq[7][i].out;
		states[i+1][52] <== and[55][i].out;
		state_changed[i].in[51] <== states[i+1][52];
		and[56][i] = AND();
		and[56][i].a <== states[i][52];
		and[56][i].b <== eq[9][i].out;
		states[i+1][53] <== and[56][i].out;
		state_changed[i].in[52] <== states[i+1][53];
		eq[26][i] = IsEqual();
		eq[26][i].in[0] <== in[i];
		eq[26][i].in[1] <== 117;
		and[57][i] = AND();
		and[57][i].a <== states[i][53];
		and[57][i].b <== eq[26][i].out;
		states[i+1][54] <== and[57][i].out;
		state_changed[i].in[53] <== states[i+1][54];
		and[58][i] = AND();
		and[58][i].a <== states[i][54];
		and[58][i].b <== eq[2][i].out;
		states[i+1][55] <== and[58][i].out;
		state_changed[i].in[54] <== states[i+1][55];
		eq[27][i] = IsEqual();
		eq[27][i].in[0] <== in[i];
		eq[27][i].in[1] <== 97;
		and[59][i] = AND();
		and[59][i].a <== states[i][55];
		and[59][i].b <== eq[27][i].out;
		states[i+1][56] <== and[59][i].out;
		state_changed[i].in[55] <== states[i+1][56];
		and[60][i] = AND();
		and[60][i].a <== states[i][56];
		and[60][i].b <== eq[3][i].out;
		states[i+1][57] <== and[60][i].out;
		state_changed[i].in[56] <== states[i+1][57];
		eq[28][i] = IsEqual();
		eq[28][i].in[0] <== in[i];
		eq[28][i].in[1] <== 58;
		and[61][i] = AND();
		and[61][i].a <== states[i][57];
		and[61][i].b <== eq[28][i].out;
		states[i+1][58] <== and[61][i].out;
		state_changed[i].in[57] <== states[i+1][58];
		and[62][i] = AND();
		and[62][i].a <== states[i][58];
		and[62][i].b <== eq[11][i].out;
		states[i+1][59] <== and[62][i].out;
		state_changed[i].in[58] <== states[i+1][59];
		and[63][i] = AND();
		and[63][i].a <== states[i][59];
		and[63][i].b <== eq[0][i].out;
		states[i+1][60] <== and[63][i].out;
		state_changed[i].in[59] <== states[i+1][60];
		and[64][i] = AND();
		and[64][i].a <== states[i][60];
		and[64][i].b <== eq[1][i].out;
		states[i+1][61] <== and[64][i].out;
		state_changed[i].in[60] <== states[i+1][61];
		and[65][i] = AND();
		and[65][i].a <== states[i][61];
		and[65][i].b <== eq[2][i].out;
		states[i+1][62] <== and[65][i].out;
		state_changed[i].in[61] <== states[i+1][62];
		and[66][i] = AND();
		and[66][i].a <== states[i][62];
		and[66][i].b <== eq[3][i].out;
		states[i+1][63] <== and[66][i].out;
		state_changed[i].in[62] <== states[i+1][63];
		and[67][i] = AND();
		and[67][i].a <== states[i][63];
		and[67][i].b <== eq[4][i].out;
		states[i+1][64] <== and[67][i].out;
		state_changed[i].in[63] <== states[i+1][64];
		and[68][i] = AND();
		and[68][i].a <== states[i][64];
		and[68][i].b <== eq[5][i].out;
		states[i+1][65] <== and[68][i].out;
		state_changed[i].in[64] <== states[i+1][65];
		and[69][i] = AND();
		and[69][i].a <== states[i][65];
		and[69][i].b <== eq[6][i].out;
		states[i+1][66] <== and[69][i].out;
		state_changed[i].in[65] <== states[i+1][66];
		and[70][i] = AND();
		and[70][i].a <== states[i][66];
		and[70][i].b <== eq[7][i].out;
		states[i+1][67] <== and[70][i].out;
		state_changed[i].in[66] <== states[i+1][67];
		eq[29][i] = IsEqual();
		eq[29][i].in[0] <== in[i];
		eq[29][i].in[1] <== 44;
		eq[30][i] = IsEqual();
		eq[30][i].in[0] <== in[i];
		eq[30][i].in[1] <== 46;
		and[71][i] = AND();
		and[71][i].a <== states[i][67];
		multi_or[4][i] = MultiOR(12);
		multi_or[4][i].in[0] <== eq[29][i].out;
		multi_or[4][i].in[1] <== eq[30][i].out;
		multi_or[4][i].in[2] <== eq[12][i].out;
		multi_or[4][i].in[3] <== eq[13][i].out;
		multi_or[4][i].in[4] <== eq[14][i].out;
		multi_or[4][i].in[5] <== eq[15][i].out;
		multi_or[4][i].in[6] <== eq[16][i].out;
		multi_or[4][i].in[7] <== eq[17][i].out;
		multi_or[4][i].in[8] <== eq[18][i].out;
		multi_or[4][i].in[9] <== eq[19][i].out;
		multi_or[4][i].in[10] <== eq[20][i].out;
		multi_or[4][i].in[11] <== eq[21][i].out;
		and[71][i].b <== multi_or[4][i].out;
		and[72][i] = AND();
		and[72][i].a <== states[i][68];
		and[72][i].b <== multi_or[4][i].out;
		multi_or[5][i] = MultiOR(2);
		multi_or[5][i].in[0] <== and[71][i].out;
		multi_or[5][i].in[1] <== and[72][i].out;
		states[i+1][68] <== multi_or[5][i].out;
		state_changed[i].in[67] <== states[i+1][68];
		and[73][i] = AND();
		and[73][i].a <== states[i][68];
		and[73][i].b <== eq[11][i].out;
		states[i+1][69] <== and[73][i].out;
		state_changed[i].in[68] <== states[i+1][69];
		and[74][i] = AND();
		and[74][i].a <== states[i][69];
		and[74][i].b <== eq[9][i].out;
		states[i+1][70] <== and[74][i].out;
		state_changed[i].in[69] <== states[i+1][70];
		eq[31][i] = IsEqual();
		eq[31][i].in[0] <== in[i];
		eq[31][i].in[1] <== 76;
		and[75][i] = AND();
		and[75][i].a <== states[i][70];
		and[75][i].b <== eq[31][i].out;
		states[i+1][71] <== and[75][i].out;
		state_changed[i].in[70] <== states[i+1][71];
		and[76][i] = AND();
		and[76][i].a <== states[i][71];
		and[76][i].b <== eq[0][i].out;
		states[i+1][72] <== and[76][i].out;
		state_changed[i].in[71] <== states[i+1][72];
		and[77][i] = AND();
		and[77][i].a <== states[i][72];
		and[77][i].b <== eq[22][i].out;
		states[i+1][73] <== and[77][i].out;
		state_changed[i].in[72] <== states[i+1][73];
		and[78][i] = AND();
		and[78][i].a <== states[i][73];
		and[78][i].b <== eq[1][i].out;
		states[i+1][74] <== and[78][i].out;
		state_changed[i].in[73] <== states[i+1][74];
		and[79][i] = AND();
		and[79][i].a <== states[i][74];
		and[79][i].b <== eq[2][i].out;
		states[i+1][75] <== and[79][i].out;
		state_changed[i].in[74] <== states[i+1][75];
		and[80][i] = AND();
		and[80][i].a <== states[i][75];
		and[80][i].b <== eq[3][i].out;
		states[i+1][76] <== and[80][i].out;
		state_changed[i].in[75] <== states[i+1][76];
		and[81][i] = AND();
		and[81][i].a <== states[i][76];
		and[81][i].b <== eq[4][i].out;
		states[i+1][77] <== and[81][i].out;
		state_changed[i].in[76] <== states[i+1][77];
		and[82][i] = AND();
		and[82][i].a <== states[i][77];
		and[82][i].b <== eq[5][i].out;
		states[i+1][78] <== and[82][i].out;
		state_changed[i].in[77] <== states[i+1][78];
		and[83][i] = AND();
		and[83][i].a <== states[i][78];
		and[83][i].b <== eq[6][i].out;
		states[i+1][79] <== and[83][i].out;
		state_changed[i].in[78] <== states[i+1][79];
		and[84][i] = AND();
		and[84][i].a <== states[i][79];
		and[84][i].b <== eq[7][i].out;
		states[i+1][80] <== and[84][i].out;
		state_changed[i].in[79] <== states[i+1][80];
		and[85][i] = AND();
		and[85][i].a <== states[i][80];
		and[85][i].b <== eq[0][i].out;
		states[i+1][81] <== and[85][i].out;
		state_changed[i].in[80] <== states[i+1][81];
		and[86][i] = AND();
		and[86][i].a <== states[i][81];
		and[86][i].b <== eq[8][i].out;
		states[i+1][82] <== and[86][i].out;
		state_changed[i].in[81] <== states[i+1][82];
		and[87][i] = AND();
		and[87][i].a <== states[i][82];
		and[87][i].b <== eq[3][i].out;
		states[i+1][83] <== and[87][i].out;
		state_changed[i].in[82] <== states[i+1][83];
		and[88][i] = AND();
		and[88][i].a <== states[i][83];
		and[88][i].b <== eq[7][i].out;
		states[i+1][84] <== and[88][i].out;
		state_changed[i].in[83] <== states[i+1][84];
		and[89][i] = AND();
		and[89][i].a <== states[i][84];
		and[89][i].b <== eq[24][i].out;
		states[i+1][85] <== and[89][i].out;
		state_changed[i].in[84] <== states[i+1][85];
		and[90][i] = AND();
		and[90][i].a <== states[i][85];
		and[90][i].b <== eq[25][i].out;
		states[i+1][86] <== and[90][i].out;
		state_changed[i].in[85] <== states[i+1][86];
		states[i+1][0] <== 1 - state_changed[i].out;
	}

	component final_state_result = MultiOR(num_bytes+1);
	for (var i = 0; i <= num_bytes; i++) {
		final_state_result.in[i] <== states[i][86];
	}
	out <== final_state_result.out;

	signal is_consecutive[msg_bytes+1][2];
	is_consecutive[msg_bytes][1] <== 1;
	for (var i = 0; i < msg_bytes; i++) {
		is_consecutive[msg_bytes-1-i][0] <== states[num_bytes-i][86] * (1 - is_consecutive[msg_bytes-i][1]) + is_consecutive[msg_bytes-i][1];
		is_consecutive[msg_bytes-1-i][1] <== state_changed[msg_bytes-i].out * is_consecutive[msg_bytes-1-i][0];
	}
	signal is_substr0[msg_bytes][3];
	signal is_reveal0[msg_bytes];
	signal output reveal0[msg_bytes];
	for (var i = 0; i < msg_bytes; i++) {
		is_substr0[i][0] <== 0;
		is_substr0[i][1] <== is_substr0[i][0] + states[i+1][1] * states[i+2][1];
		is_substr0[i][2] <== is_substr0[i][1] + states[i+1][9] * states[i+2][1];
		is_reveal0[i] <== is_substr0[i][2] * is_consecutive[i][1];
		reveal0[i] <== in[i+1] * is_reveal0[i];
	}
	signal is_substr1[msg_bytes][5];
	signal is_reveal1[msg_bytes];
	signal output reveal1[msg_bytes];
	for (var i = 0; i < msg_bytes; i++) {
		is_substr1[i][0] <== 0;
		is_substr1[i][1] <== is_substr1[i][0] + states[i+1][13] * states[i+2][14];
		is_substr1[i][2] <== is_substr1[i][1] + states[i+1][14] * states[i+2][15];
		is_substr1[i][3] <== is_substr1[i][2] + states[i+1][15] * states[i+2][16];
		is_substr1[i][4] <== is_substr1[i][3] + states[i+1][16] * states[i+2][16];
		is_reveal1[i] <== is_substr1[i][4] * is_consecutive[i][1];
		reveal1[i] <== in[i+1] * is_reveal1[i];
	}
	signal is_substr2[msg_bytes][3];
	signal is_reveal2[msg_bytes];
	signal output reveal2[msg_bytes];
	for (var i = 0; i < msg_bytes; i++) {
		is_substr2[i][0] <== 0;
		is_substr2[i][1] <== is_substr2[i][0] + states[i+1][67] * states[i+2][68];
		is_substr2[i][2] <== is_substr2[i][1] + states[i+1][68] * states[i+2][68];
		is_reveal2[i] <== is_substr2[i][2] * is_consecutive[i][1];
		reveal2[i] <== in[i+1] * is_reveal2[i];
	}
}