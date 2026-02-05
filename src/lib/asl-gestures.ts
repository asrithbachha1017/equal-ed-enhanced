/**
 * ASL Alphabet Gesture Definitions for Fingerpose
 * 
 * IMPROVED VERSION with better disambiguation for similar letters.
 * 
 * Each gesture defines the finger curl and direction patterns
 * for recognizing ASL alphabet letters A-Z.
 * 
 * Key improvements:
 * - Added direction constraints to disambiguate A/E/M/N/S/T
 * - Refined thumb position requirements
 * - Added weighted scoring for critical features
 * 
 * Based on: https://github.com/syauqy/handsign-tensorflow
 * Reference: https://github.com/andypotato/fingerpose
 */

import { Finger, FingerCurl, FingerDirection, GestureDescription } from "fingerpose";

// ====== LETTER A ======
// Fist with thumb alongside fingers (thumb UP alongside, not across)
export const letterA = new GestureDescription("A");
letterA.addCurl(Finger.Thumb, FingerCurl.NoCurl, 1.0);
letterA.addDirection(Finger.Thumb, FingerDirection.VerticalUp, 0.9);
letterA.addDirection(Finger.Thumb, FingerDirection.DiagonalUpLeft, 0.7);
letterA.addDirection(Finger.Thumb, FingerDirection.DiagonalUpRight, 0.7);
letterA.addCurl(Finger.Index, FingerCurl.FullCurl, 1.0);
letterA.addCurl(Finger.Middle, FingerCurl.FullCurl, 1.0);
letterA.addCurl(Finger.Ring, FingerCurl.FullCurl, 1.0);
letterA.addCurl(Finger.Pinky, FingerCurl.FullCurl, 1.0);

// ====== LETTER B ======
// Flat hand, fingers together pointing UP, thumb tucked across palm
export const letterB = new GestureDescription("B");
letterB.addCurl(Finger.Thumb, FingerCurl.HalfCurl, 1.0);
letterB.addCurl(Finger.Index, FingerCurl.NoCurl, 1.0);
letterB.addDirection(Finger.Index, FingerDirection.VerticalUp, 0.9);
letterB.addCurl(Finger.Middle, FingerCurl.NoCurl, 1.0);
letterB.addDirection(Finger.Middle, FingerDirection.VerticalUp, 0.9);
letterB.addCurl(Finger.Ring, FingerCurl.NoCurl, 1.0);
letterB.addDirection(Finger.Ring, FingerDirection.VerticalUp, 0.9);
letterB.addCurl(Finger.Pinky, FingerCurl.NoCurl, 1.0);
letterB.addDirection(Finger.Pinky, FingerDirection.VerticalUp, 0.9);

// ====== LETTER C ======
// Curved hand like holding a ball - all half curl
export const letterC = new GestureDescription("C");
letterC.addCurl(Finger.Thumb, FingerCurl.NoCurl, 0.8);
letterC.addCurl(Finger.Thumb, FingerCurl.HalfCurl, 0.9);
letterC.addCurl(Finger.Index, FingerCurl.HalfCurl, 1.0);
letterC.addCurl(Finger.Middle, FingerCurl.HalfCurl, 1.0);
letterC.addCurl(Finger.Ring, FingerCurl.HalfCurl, 1.0);
letterC.addCurl(Finger.Pinky, FingerCurl.HalfCurl, 1.0);

// ====== LETTER D ======
// Index pointing UP, other fingers curled, thumb makes circle with middle
export const letterD = new GestureDescription("D");
letterD.addCurl(Finger.Thumb, FingerCurl.HalfCurl, 0.9);
letterD.addCurl(Finger.Index, FingerCurl.NoCurl, 1.0);
letterD.addDirection(Finger.Index, FingerDirection.VerticalUp, 1.0);
letterD.addCurl(Finger.Middle, FingerCurl.FullCurl, 1.0);
letterD.addCurl(Finger.Ring, FingerCurl.FullCurl, 1.0);
letterD.addCurl(Finger.Pinky, FingerCurl.FullCurl, 1.0);

// ====== LETTER E ======
// All fingers curled into palm, thumb ACROSS (horizontal)
export const letterE = new GestureDescription("E");
letterE.addCurl(Finger.Thumb, FingerCurl.HalfCurl, 1.0);
letterE.addDirection(Finger.Thumb, FingerDirection.HorizontalLeft, 0.8);
letterE.addDirection(Finger.Thumb, FingerDirection.HorizontalRight, 0.8);
letterE.addCurl(Finger.Index, FingerCurl.FullCurl, 1.0);
letterE.addCurl(Finger.Middle, FingerCurl.FullCurl, 1.0);
letterE.addCurl(Finger.Ring, FingerCurl.FullCurl, 1.0);
letterE.addCurl(Finger.Pinky, FingerCurl.FullCurl, 1.0);

// ====== LETTER F ======
// Thumb and index touch forming circle, other fingers extended UP
export const letterF = new GestureDescription("F");
letterF.addCurl(Finger.Thumb, FingerCurl.HalfCurl, 1.0);
letterF.addCurl(Finger.Index, FingerCurl.FullCurl, 0.9);
letterF.addCurl(Finger.Index, FingerCurl.HalfCurl, 0.8);
letterF.addCurl(Finger.Middle, FingerCurl.NoCurl, 1.0);
letterF.addDirection(Finger.Middle, FingerDirection.VerticalUp, 0.9);
letterF.addCurl(Finger.Ring, FingerCurl.NoCurl, 1.0);
letterF.addDirection(Finger.Ring, FingerDirection.VerticalUp, 0.9);
letterF.addCurl(Finger.Pinky, FingerCurl.NoCurl, 1.0);
letterF.addDirection(Finger.Pinky, FingerDirection.VerticalUp, 0.9);

// ====== LETTER G ======
// Index and thumb pointing SIDEWAYS (horizontal)
export const letterG = new GestureDescription("G");
letterG.addCurl(Finger.Thumb, FingerCurl.NoCurl, 1.0);
letterG.addDirection(Finger.Thumb, FingerDirection.HorizontalLeft, 0.9);
letterG.addDirection(Finger.Thumb, FingerDirection.HorizontalRight, 0.9);
letterG.addCurl(Finger.Index, FingerCurl.NoCurl, 1.0);
letterG.addDirection(Finger.Index, FingerDirection.HorizontalLeft, 0.9);
letterG.addDirection(Finger.Index, FingerDirection.HorizontalRight, 0.9);
letterG.addCurl(Finger.Middle, FingerCurl.FullCurl, 1.0);
letterG.addCurl(Finger.Ring, FingerCurl.FullCurl, 1.0);
letterG.addCurl(Finger.Pinky, FingerCurl.FullCurl, 1.0);

// ====== LETTER H ======
// Index and middle extended HORIZONTALLY (pointing sideways)
export const letterH = new GestureDescription("H");
letterH.addCurl(Finger.Thumb, FingerCurl.HalfCurl, 1.0);
letterH.addCurl(Finger.Index, FingerCurl.NoCurl, 1.0);
letterH.addDirection(Finger.Index, FingerDirection.HorizontalLeft, 0.9);
letterH.addDirection(Finger.Index, FingerDirection.HorizontalRight, 0.9);
letterH.addCurl(Finger.Middle, FingerCurl.NoCurl, 1.0);
letterH.addDirection(Finger.Middle, FingerDirection.HorizontalLeft, 0.9);
letterH.addDirection(Finger.Middle, FingerDirection.HorizontalRight, 0.9);
letterH.addCurl(Finger.Ring, FingerCurl.FullCurl, 1.0);
letterH.addCurl(Finger.Pinky, FingerCurl.FullCurl, 1.0);

// ====== LETTER I ======
// Pinky extended UP, all others curled
export const letterI = new GestureDescription("I");
letterI.addCurl(Finger.Thumb, FingerCurl.HalfCurl, 1.0);
letterI.addCurl(Finger.Index, FingerCurl.FullCurl, 1.0);
letterI.addCurl(Finger.Middle, FingerCurl.FullCurl, 1.0);
letterI.addCurl(Finger.Ring, FingerCurl.FullCurl, 1.0);
letterI.addCurl(Finger.Pinky, FingerCurl.NoCurl, 1.0);
letterI.addDirection(Finger.Pinky, FingerDirection.VerticalUp, 1.0);

// ====== LETTER K ======
// Index UP, middle UP at angle, thumb between them
export const letterK = new GestureDescription("K");
letterK.addCurl(Finger.Thumb, FingerCurl.NoCurl, 1.0);
letterK.addDirection(Finger.Thumb, FingerDirection.DiagonalUpLeft, 0.8);
letterK.addDirection(Finger.Thumb, FingerDirection.DiagonalUpRight, 0.8);
letterK.addCurl(Finger.Index, FingerCurl.NoCurl, 1.0);
letterK.addDirection(Finger.Index, FingerDirection.VerticalUp, 0.9);
letterK.addDirection(Finger.Index, FingerDirection.DiagonalUpLeft, 0.8);
letterK.addDirection(Finger.Index, FingerDirection.DiagonalUpRight, 0.8);
letterK.addCurl(Finger.Middle, FingerCurl.NoCurl, 1.0);
letterK.addDirection(Finger.Middle, FingerDirection.VerticalUp, 1.0);
letterK.addCurl(Finger.Ring, FingerCurl.FullCurl, 1.0);
letterK.addCurl(Finger.Pinky, FingerCurl.FullCurl, 1.0);

// ====== LETTER L ======
// Thumb and index form L shape - thumb HORIZONTAL, index UP
export const letterL = new GestureDescription("L");
letterL.addCurl(Finger.Thumb, FingerCurl.NoCurl, 1.0);
letterL.addDirection(Finger.Thumb, FingerDirection.HorizontalLeft, 1.0);
letterL.addDirection(Finger.Thumb, FingerDirection.HorizontalRight, 1.0);
letterL.addCurl(Finger.Index, FingerCurl.NoCurl, 1.0);
letterL.addDirection(Finger.Index, FingerDirection.VerticalUp, 1.0);
letterL.addCurl(Finger.Middle, FingerCurl.FullCurl, 1.0);
letterL.addCurl(Finger.Ring, FingerCurl.FullCurl, 1.0);
letterL.addCurl(Finger.Pinky, FingerCurl.FullCurl, 1.0);

// ====== LETTER M ======
// Three fingers over thumb, thumb HIDDEN under fingers
export const letterM = new GestureDescription("M");
letterM.addCurl(Finger.Thumb, FingerCurl.FullCurl, 1.0);
letterM.addDirection(Finger.Thumb, FingerDirection.DiagonalDownLeft, 0.7);
letterM.addDirection(Finger.Thumb, FingerDirection.DiagonalDownRight, 0.7);
letterM.addCurl(Finger.Index, FingerCurl.FullCurl, 1.0);
letterM.addDirection(Finger.Index, FingerDirection.DiagonalDownLeft, 0.6);
letterM.addDirection(Finger.Index, FingerDirection.DiagonalDownRight, 0.6);
letterM.addCurl(Finger.Middle, FingerCurl.FullCurl, 1.0);
letterM.addCurl(Finger.Ring, FingerCurl.FullCurl, 1.0);
letterM.addCurl(Finger.Pinky, FingerCurl.FullCurl, 1.0);

// ====== LETTER N ======
// Two fingers over thumb (index and middle down over thumb)
export const letterN = new GestureDescription("N");
letterN.addCurl(Finger.Thumb, FingerCurl.FullCurl, 1.0);
letterN.addCurl(Finger.Index, FingerCurl.FullCurl, 1.0);
letterN.addCurl(Finger.Middle, FingerCurl.FullCurl, 1.0);
letterN.addCurl(Finger.Ring, FingerCurl.FullCurl, 1.0);
letterN.addCurl(Finger.Pinky, FingerCurl.FullCurl, 1.0);
// N differs from M by having ring finger more visible - hard to distinguish

// ====== LETTER O ======
// All fingers curved to touch thumb forming O shape
export const letterO = new GestureDescription("O");
letterO.addCurl(Finger.Thumb, FingerCurl.HalfCurl, 1.0);
letterO.addCurl(Finger.Index, FingerCurl.HalfCurl, 1.0);
letterO.addCurl(Finger.Middle, FingerCurl.HalfCurl, 1.0);
letterO.addCurl(Finger.Ring, FingerCurl.HalfCurl, 1.0);
letterO.addCurl(Finger.Pinky, FingerCurl.HalfCurl, 1.0);

// ====== LETTER P ======
// Like K but pointing DOWN
export const letterP = new GestureDescription("P");
letterP.addCurl(Finger.Thumb, FingerCurl.NoCurl, 1.0);
letterP.addDirection(Finger.Thumb, FingerDirection.DiagonalDownLeft, 0.9);
letterP.addDirection(Finger.Thumb, FingerDirection.DiagonalDownRight, 0.9);
letterP.addCurl(Finger.Index, FingerCurl.NoCurl, 1.0);
letterP.addDirection(Finger.Index, FingerDirection.DiagonalDownLeft, 1.0);
letterP.addDirection(Finger.Index, FingerDirection.DiagonalDownRight, 1.0);
letterP.addCurl(Finger.Middle, FingerCurl.NoCurl, 1.0);
letterP.addDirection(Finger.Middle, FingerDirection.DiagonalDownLeft, 0.9);
letterP.addDirection(Finger.Middle, FingerDirection.DiagonalDownRight, 0.9);
letterP.addCurl(Finger.Ring, FingerCurl.FullCurl, 1.0);
letterP.addCurl(Finger.Pinky, FingerCurl.FullCurl, 1.0);

// ====== LETTER Q ======
// Thumb and index pointing DOWN
export const letterQ = new GestureDescription("Q");
letterQ.addCurl(Finger.Thumb, FingerCurl.NoCurl, 1.0);
letterQ.addDirection(Finger.Thumb, FingerDirection.DiagonalDownLeft, 1.0);
letterQ.addDirection(Finger.Thumb, FingerDirection.DiagonalDownRight, 1.0);
letterQ.addCurl(Finger.Index, FingerCurl.NoCurl, 1.0);
letterQ.addDirection(Finger.Index, FingerDirection.DiagonalDownLeft, 1.0);
letterQ.addDirection(Finger.Index, FingerDirection.DiagonalDownRight, 1.0);
letterQ.addCurl(Finger.Middle, FingerCurl.FullCurl, 1.0);
letterQ.addCurl(Finger.Ring, FingerCurl.FullCurl, 1.0);
letterQ.addCurl(Finger.Pinky, FingerCurl.FullCurl, 1.0);

// ====== LETTER R ======
// Index and middle crossed (both up)
export const letterR = new GestureDescription("R");
letterR.addCurl(Finger.Thumb, FingerCurl.HalfCurl, 1.0);
letterR.addCurl(Finger.Index, FingerCurl.NoCurl, 1.0);
letterR.addDirection(Finger.Index, FingerDirection.VerticalUp, 0.9);
letterR.addCurl(Finger.Middle, FingerCurl.NoCurl, 1.0);
letterR.addDirection(Finger.Middle, FingerDirection.VerticalUp, 0.9);
letterR.addCurl(Finger.Ring, FingerCurl.FullCurl, 1.0);
letterR.addCurl(Finger.Pinky, FingerCurl.FullCurl, 1.0);

// ====== LETTER S ======
// Fist with thumb ACROSS front of fingers (horizontal across)
export const letterS = new GestureDescription("S");
letterS.addCurl(Finger.Thumb, FingerCurl.HalfCurl, 1.0);
letterS.addCurl(Finger.Thumb, FingerCurl.FullCurl, 0.8);
letterS.addDirection(Finger.Thumb, FingerDirection.HorizontalLeft, 0.7);
letterS.addDirection(Finger.Thumb, FingerDirection.HorizontalRight, 0.7);
letterS.addCurl(Finger.Index, FingerCurl.FullCurl, 1.0);
letterS.addCurl(Finger.Middle, FingerCurl.FullCurl, 1.0);
letterS.addCurl(Finger.Ring, FingerCurl.FullCurl, 1.0);
letterS.addCurl(Finger.Pinky, FingerCurl.FullCurl, 1.0);

// ====== LETTER T ======
// Thumb BETWEEN index and middle (poking out)
export const letterT = new GestureDescription("T");
letterT.addCurl(Finger.Thumb, FingerCurl.NoCurl, 0.9);
letterT.addCurl(Finger.Thumb, FingerCurl.HalfCurl, 0.8);
letterT.addDirection(Finger.Thumb, FingerDirection.VerticalUp, 0.8);
letterT.addDirection(Finger.Thumb, FingerDirection.DiagonalUpLeft, 0.7);
letterT.addDirection(Finger.Thumb, FingerDirection.DiagonalUpRight, 0.7);
letterT.addCurl(Finger.Index, FingerCurl.FullCurl, 1.0);
letterT.addCurl(Finger.Middle, FingerCurl.FullCurl, 1.0);
letterT.addCurl(Finger.Ring, FingerCurl.FullCurl, 1.0);
letterT.addCurl(Finger.Pinky, FingerCurl.FullCurl, 1.0);

// ====== LETTER U ======
// Index and middle UP together (parallel, touching)
export const letterU = new GestureDescription("U");
letterU.addCurl(Finger.Thumb, FingerCurl.HalfCurl, 1.0);
letterU.addCurl(Finger.Index, FingerCurl.NoCurl, 1.0);
letterU.addDirection(Finger.Index, FingerDirection.VerticalUp, 1.0);
letterU.addCurl(Finger.Middle, FingerCurl.NoCurl, 1.0);
letterU.addDirection(Finger.Middle, FingerDirection.VerticalUp, 1.0);
letterU.addCurl(Finger.Ring, FingerCurl.FullCurl, 1.0);
letterU.addCurl(Finger.Pinky, FingerCurl.FullCurl, 1.0);

// ====== LETTER V ======
// Victory sign - index and middle UP and SPREAD apart
export const letterV = new GestureDescription("V");
letterV.addCurl(Finger.Thumb, FingerCurl.HalfCurl, 1.0);
letterV.addCurl(Finger.Index, FingerCurl.NoCurl, 1.0);
letterV.addDirection(Finger.Index, FingerDirection.DiagonalUpLeft, 0.9);
letterV.addDirection(Finger.Index, FingerDirection.DiagonalUpRight, 0.9);
letterV.addDirection(Finger.Index, FingerDirection.VerticalUp, 0.7);
letterV.addCurl(Finger.Middle, FingerCurl.NoCurl, 1.0);
letterV.addDirection(Finger.Middle, FingerDirection.DiagonalUpLeft, 0.9);
letterV.addDirection(Finger.Middle, FingerDirection.DiagonalUpRight, 0.9);
letterV.addDirection(Finger.Middle, FingerDirection.VerticalUp, 0.7);
letterV.addCurl(Finger.Ring, FingerCurl.FullCurl, 1.0);
letterV.addCurl(Finger.Pinky, FingerCurl.FullCurl, 1.0);

// ====== LETTER W ======
// Three fingers UP (index, middle, ring) spread
export const letterW = new GestureDescription("W");
letterW.addCurl(Finger.Thumb, FingerCurl.HalfCurl, 1.0);
letterW.addCurl(Finger.Index, FingerCurl.NoCurl, 1.0);
letterW.addDirection(Finger.Index, FingerDirection.VerticalUp, 0.9);
letterW.addDirection(Finger.Index, FingerDirection.DiagonalUpLeft, 0.8);
letterW.addDirection(Finger.Index, FingerDirection.DiagonalUpRight, 0.8);
letterW.addCurl(Finger.Middle, FingerCurl.NoCurl, 1.0);
letterW.addDirection(Finger.Middle, FingerDirection.VerticalUp, 1.0);
letterW.addCurl(Finger.Ring, FingerCurl.NoCurl, 1.0);
letterW.addDirection(Finger.Ring, FingerDirection.VerticalUp, 0.9);
letterW.addDirection(Finger.Ring, FingerDirection.DiagonalUpLeft, 0.8);
letterW.addDirection(Finger.Ring, FingerDirection.DiagonalUpRight, 0.8);
letterW.addCurl(Finger.Pinky, FingerCurl.FullCurl, 1.0);

// ====== LETTER X ======
// Index bent at knuckle (hook shape)
export const letterX = new GestureDescription("X");
letterX.addCurl(Finger.Thumb, FingerCurl.HalfCurl, 1.0);
letterX.addCurl(Finger.Index, FingerCurl.HalfCurl, 1.0);
letterX.addDirection(Finger.Index, FingerDirection.VerticalUp, 0.8);
letterX.addDirection(Finger.Index, FingerDirection.DiagonalUpLeft, 0.7);
letterX.addDirection(Finger.Index, FingerDirection.DiagonalUpRight, 0.7);
letterX.addCurl(Finger.Middle, FingerCurl.FullCurl, 1.0);
letterX.addCurl(Finger.Ring, FingerCurl.FullCurl, 1.0);
letterX.addCurl(Finger.Pinky, FingerCurl.FullCurl, 1.0);

// ====== LETTER Y ======
// Thumb and pinky extended OUT (hang loose / shaka)
export const letterY = new GestureDescription("Y");
letterY.addCurl(Finger.Thumb, FingerCurl.NoCurl, 1.0);
letterY.addDirection(Finger.Thumb, FingerDirection.HorizontalLeft, 0.8);
letterY.addDirection(Finger.Thumb, FingerDirection.HorizontalRight, 0.8);
letterY.addDirection(Finger.Thumb, FingerDirection.DiagonalUpLeft, 0.7);
letterY.addDirection(Finger.Thumb, FingerDirection.DiagonalUpRight, 0.7);
letterY.addCurl(Finger.Index, FingerCurl.FullCurl, 1.0);
letterY.addCurl(Finger.Middle, FingerCurl.FullCurl, 1.0);
letterY.addCurl(Finger.Ring, FingerCurl.FullCurl, 1.0);
letterY.addCurl(Finger.Pinky, FingerCurl.NoCurl, 1.0);
letterY.addDirection(Finger.Pinky, FingerDirection.HorizontalLeft, 0.8);
letterY.addDirection(Finger.Pinky, FingerDirection.HorizontalRight, 0.8);
letterY.addDirection(Finger.Pinky, FingerDirection.DiagonalUpLeft, 0.7);
letterY.addDirection(Finger.Pinky, FingerDirection.DiagonalUpRight, 0.7);

// Export all gestures as an array
export const ASL_GESTURES = [
    letterA,
    letterB,
    letterC,
    letterD,
    letterE,
    letterF,
    letterG,
    letterH,
    letterI,
    letterK,
    letterL,
    letterM,
    letterN,
    letterO,
    letterP,
    letterQ,
    letterR,
    letterS,
    letterT,
    letterU,
    letterV,
    letterW,
    letterX,
    letterY,
];

// Note: J and Z require motion and cannot be detected with static hand pose analysis
