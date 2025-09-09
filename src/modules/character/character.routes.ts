import { Router } from 'express';
import { 
  createCharacterController,
  getCharacterController,
  updateCharacterController,
  deleteCharacterController,
  getCharacterStatsController
} from './character.controller.js';

const router = Router();

router.post('/create-character', createCharacterController);
router.get('/get-character', getCharacterController);
router.get('/character/:characterId', getCharacterController); // Frontend passes characterId as param
router.put('/update-character', updateCharacterController);
router.delete('/delete-character', deleteCharacterController);
router.get('/character-stats', getCharacterStatsController);

export default router;