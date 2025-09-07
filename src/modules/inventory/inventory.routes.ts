import { Router } from 'express';
import {
  getInventoryController,
  addItemController,
  removeItemController,
  equipItemController,
  unequipItemController,
  useItemController,
  getEquipmentController,
  updateGoldController,
  getBoatProgressController,
  craftBoatController
} from './inventory.controller.js';

const router = Router();

router.get('/get-inventory', getInventoryController);
router.post('/add-item', addItemController);
router.post('/remove-item', removeItemController);
router.post('/equip-item', equipItemController);
router.post('/unequip-item', unequipItemController);
router.post('/use-item', useItemController);
router.get('/get-equipment', getEquipmentController);
router.post('/update-gold', updateGoldController);
router.get('/get-boat-progress', getBoatProgressController);
router.post('/craft-boat', craftBoatController);

export default router;