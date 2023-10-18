import {Router} from 'express'
import { list, item, create, upload, verifyInputs, verifyUpdateInputs, itemById, update, remove, changeState, deleteMultiple } from './Controller.js';
import { response, imagesHolder } from "../../utils.js"
import { signinRequired } from "../Auth/Controller.js"

const router = new Router();

router.param('carPartId', itemById);

router.get('/', list)
router.delete('/delete-multiple', signinRequired, deleteMultiple)

router.get('/:carPartId', item)
router.post('/', signinRequired, imagesHolder, upload.array('images'), verifyInputs, create)
router.put('/:carPartId', signinRequired, imagesHolder, upload.array('images'), verifyUpdateInputs, update)
router.put('/:carPartId/change-state', signinRequired, changeState)
router.delete('/:carPartId', signinRequired, remove)




export default router;