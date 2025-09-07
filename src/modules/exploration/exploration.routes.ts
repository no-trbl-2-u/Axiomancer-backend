import { Router } from 'express';
import {
  getLocationController,
  moveToLocationController,
  getAvailableAreasController
} from './exploration.controller.js';

const router = Router();

router.get('/get-location', getLocationController);
router.post('/move-to-location', moveToLocationController);
router.get('/get-available-areas', getAvailableAreasController);

export default router;