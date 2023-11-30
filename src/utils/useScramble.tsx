import { useState } from "react";
// import scrambleGenerator from "rubiks-cube-scramble";
import { Scrambow } from 'scrambow';
const CUBE_SCRAMBLE_OPTIONS_DEFAULT = {array: false, turns: 21};

export function useScramble({turns=21}: {turns?: number}): [string, () => void, (scramble: string) => void] {
	const cube = new Scrambow().setSeed(Date.now());
	const [ scramble, setScramble ] = useState(cube.get()[0].scramble_string);
	const refreshScramble = () => setScramble(cube.get()[0].scramble_string);
	return [scramble, refreshScramble, setScramble];
}