/**
 * 
 */

var ParamLoader = function() {

  this.GoalWidth = 100;

  this.NumSupportSpotsX = 13;
  this.NumSupportSpotsY = 6;

  this.Spot_PassSafeScore = 2.0;
  this.Spot_CanScoreFromPositionScore = 1.0;
  this.Spot_DistFromControllingPlayerScore = 2.0;
  this.Spot_ClosenessToSupportingPlayerScore = 0.0;
  this.Spot_AheadOfAttackerScore = 0.0;

  this.SupportSpotUpdateFreq = 1.0;

  this.ChancePlayerAttemptsPotShot = 0.005;
  this.ChanceOfUsingArriveTypeReceiveBehavior = 0.5;

  this.BallSize = 5.0;
  this.BallMass = 1.0;
  this.Friction = -0.015;

  this.KeeperInBallRange = 10.0;
  this.PlayerInTargetRange = 10.0 ;
  this.PlayerKickingDistance = 11.0;
  this.PlayerKickFrequency = 8.0;

  this.PlayerMass = 3.0;
  this.PlayerMaxForce = 1.0;
  this.PlayerMaxSpeedWithBall = 1.2;
  this.PlayerMaxSpeedWithoutBall = 1.6;
  this.PlayerMaxTurnRate = 0.4;
  this.PlayerScale = 1.0;
  this.PlayerComfortZone = 60.0;
  this.PlayerKickingAccuracy = 0.99;

  this.NumAttemptsToFindValidStrike = 5;

  this.MaxDribbleForce = 1.5;
  this.MaxShootingForce = 6.0;
  this.MaxPassingForce = 3.0;

  this.WithinRangeOfHome = 15.0;
  this.WithinRangeOfSupportSpot = 15.0;

  this.MinPassDist = 120.0;
  this.GoalkeeperMinPassDist = 50.0;

  this.GoalKeeperTendingDistance = 20.0;
  this.GoalKeeperInterceptRange = 100.0;
  this.BallWithinReceivingRange = 10.0;

  this.bStates = true;
  this.bIDs = true;
  this.bSupportSpots = true;
  this.bRegions = true;
  this.bShowControllingTeam = true;
  this.bViewTargets = true;
  this.bHighlightIfThreatened = true;

  this.FrameRate = 60;

  this.SeparationCoefficient = 10.0;
  this.ViewDistance = 30.0;
  this.bNonPenetrationConstraint = false;

  this.BallWithinReceivingRangeSq = this.BallWithinReceivingRange * this.BallWithinReceivingRange;
  this.KeeperInBallRangeSq = this.KeeperInBallRange * this.KeeperInBallRange;
  this.PlayerInTargetRangeSq = this.PlayerInTargetRange * this.PlayerInTargetRange;
  //this.PlayerKickingDistance += this.BallSize;
  this.PlayerKickingDistanceSq = this.PlayerKickingDistance * this.PlayerKickingDistance;
  this.PlayerComfortZoneSq = this.PlayerComfortZone * this.PlayerComfortZone;
  this.GoalKeeperInterceptRangeSq = this.GoalKeeperInterceptRange * this.GoalKeeperInterceptRange;
  this.WithinRangeOfSupportSpotSq = this.WithinRangeOfSupportSpot * this.WithinRangeOfSupportSpot;

};

let Prm = new ParamLoader();