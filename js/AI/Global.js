/*
* Global value
*
*/

let MaxInt = Number.MAX_SAFE_INTEGER;
let MaxDouble = Number.MAX_VALUE;
let MinDouble = Number.MIN_VALUE;
let MaxFloat = Number.MAX_VALUE;
let MinFloat = Number.MIN_VALUE;
let Pi = Math.PI;
let TwoPi = Math.PI * 2;
let HalfPi = Math.PI / 2;
let QuarterPi = Math.PI / 4;
let EpsilonDouble = Number.EPSILON;

let ttos = function( s ){
    return String( s );
};

//----------- Globals
class Global{};
Global.objReceiverRef = new Object();
Global.m_iNextValidID = 0;
Global.AllPlayers = new Array();
Global.MessageTypes = {
    Msg_ReceiveBall: "Msg_ReceiveBall",
    Msg_PassToMe: "Msg_PassToMe",
    Msg_SupportAttacker: "Msg_SupportAttacker",
    Msg_GoHome: "Msg_GoHome",
    Msg_Wait: "Msg_Wait",
    default:"INVALID MESSAGE!!"
};