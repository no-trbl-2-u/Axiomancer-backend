import { Router } from 'express';
import {
  initiateCombatController,
  combatActionController,
  useSpecialAttackController,
  fallacyChallengeController,
  demonContractController,
  summonDemonController,
  getCombatStatisticsController,
  getAvailableSpecialAttacksController
} from './combat.controller.js';

const router = Router();

router.post('/initiate-combat', initiateCombatController);
router.post('/combat-action', combatActionController);
router.post('/use-special-attack', useSpecialAttackController);
router.post('/fallacy-challenge', fallacyChallengeController);
router.post('/demon-contract', demonContractController);
router.post('/summon-demon', summonDemonController);
router.get('/combat-statistics', getCombatStatisticsController);
router.get('/available-special-attacks', getAvailableSpecialAttacksController);

export default router;