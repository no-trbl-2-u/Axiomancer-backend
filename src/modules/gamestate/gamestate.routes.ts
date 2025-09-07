import { Router } from 'express';
import {
  getGameStateController,
  updateGameStateController,
  saveGameController,
  loadGameController,
  getSaveSlotsController,
  deleteSaveController,
  updateStoryMilestoneController
} from './gamestate.controller.js';

const router = Router();

router.get('/get-game-state', getGameStateController);
router.post('/update-game-state', updateGameStateController);
router.post('/save-game', saveGameController);
router.post('/load-game', loadGameController);
router.get('/get-save-slots', getSaveSlotsController);
router.delete('/delete-save', deleteSaveController);
router.post('/update-story-milestone', updateStoryMilestoneController);

export default router;