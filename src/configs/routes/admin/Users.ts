import AdminUserController from '@controllers/api/admin/admin-user.controller';
import { withoutSavingUploader } from '@middlewares/uploaders';
import { Router } from 'express';
import { isAdmin } from '@middlewares/checkRole';

const router = Router();

/**
 * @openapi
 * /a/users/:
 *   get:
 *     tags:
 *      - "[ADMIN] USERS"
 *     summary: Danh sách user/bộ lọc
 *     description: Danh sách user/bộ lọc
 *     parameters:
 *      - in: query
 *        name: "page"
 *        description: "page"
 *        type: "number"
*      - in: query
 *        name: "limit"
 *        description: "limit"
 *        type: "number"
 *      - in: query
 *        name: "sortOrder"
 *        description: "sortOrder"
 *        type: "enum"
 *        enum:
 *          - DESC
 *          - ASC
 *      - in: query
 *        name: "sortBy"
 *        description: "sortBy"
 *        type: "string"
 *      - in: query
 *        name: "freeWord"
 *        description: "freeWord"
 *        type: "string"
 *      - in: query
 *        name: "status"
 *        description: "status"
 *        type: "string"
 *        enum:
 *          - active
 *          - inactive
 *      - in: query
 *        name: "positionIds"
 *        schema:
 *          type: string
 *        description: Lọc theo Id chức vụ
 *     responses:
 *       200:
 *         description: "Upload success"
 *       404:
 *         description: Không tìm thấy dữ liệu
 *       500:
 *        description: Lỗi không xác định
 *     security:
 *      - Bearer: []
 */
router.get('/', isAdmin, AdminUserController.index);

/**
 * @openapi
 * /a/users/download:
 *   get:
 *     tags:
 *      - "[ADMIN] USERS"
 *     summary: Tải xuống danh sách nhân viên
 *     description: Tải xuống danh sách nhân viên
 *     responses:
 *       200:
 *         description: "Upload success"
 *       404:
 *         description: Không tìm thấy dữ liệu
 *       500:
 *        description: Lỗi không xác định
 *     security:
 *      - Bearer: []
 */
router.get('/download', isAdmin, AdminUserController.download);

/**
  * @openapi
  * /a/users/upload:
  *   patch:
  *     tags:
  *      - "[ADMIN] USERS"
  *     summary: Tải lên danh sách nhân viên
  *     consumes:
  *      - "multipart/form-data"
  *     produces:
  *      - "application/json"
  *     parameters:
  *      - in: "formData"
  *        name: "file"
  *        description: "File upload"
  *        required: false
  *        allowMultiple: true
  *        type: "file"
  *     responses:
  *       200:
  *         description: "Upload success"
  *       404:
  *         description: Không tìm thấy dữ liệu
  *       500:
  *        description: Lỗi không xác định
  *     security:
  *      - Bearer: []
  */
router.patch('/upload', withoutSavingUploader.single('file'), AdminUserController.upload);

/**
 * @openapi
 * /a/users/update_current:
 *   patch:
 *     tags:
 *      - "[ADMIN] USERS"
 *     summary: Cập nhật thông tin user hiện tại
 *     description: Cập nhật thông tin user hiện tại
 *     parameters:
 *      - in: "body"
 *        name: "body"
 *        description: "User object"
 *        required: true
 *        schema:
 *          type: "object"
 *          properties:
 *            fullName:
 *              type: "string"
 *            phoneNumber:
 *              type: "string"
 *            address:
 *              type: "string"
 *            dateOfBirth:
 *              type: "string"
 *              format: "date"
 *            gender:
 *              type: "string"
 *              enum:
 *                - male
 *                - female
 *                - other
 *     responses:
 *       200:
 *         description: "Update success"
 *       400:
 *         description: Bad request
 *       401:
 *         description: Unauthorized
 *       500:
 *        description: Lỗi không xác định
 *     security:
 *      - Bearer: []
 */
router.patch('/update_current', AdminUserController.updateCurrent);

/**
 * @openapi
 * /a/users/:
 *   post:
 *     tags:
 *      - "[ADMIN] USERS"
 *     summary: Tạo user mới
 *     description: Tạo user mới
 *     parameters:
 *      - in: "body"
 *        name: "body"
 *        description: "User object"
 *        required: true
 *        schema:
 *          type: "object"
 *          required:
 *            - employeeCode
 *            - fullName
 *            - email
 *            - password
 *          properties:
 *            employeeCode:
 *              type: "string"
 *            fullName:
 *              type: "string"
 *            email:
 *              type: "string"
 *            password:
 *              type: "string"
 *            departmentId:
 *              type: "integer"
 *            positionId:
 *              type: "integer"
 *            phoneNumber:
 *              type: "string"
 *            address:
 *              type: "string"
 *            dateOfBirth:
 *              type: "string"
 *              format: "date"
 *            gender:
 *              type: "string"
 *              enum:
 *                - male
 *                - female
 *                - other
 *            status:
 *              type: "string"
 *              enum:
 *                - active
 *                - inactive
 *            role:
 *              type: "string"
 *              enum:
 *                - admin
 *                - user
 *                - manager
 *     responses:
 *       201:
 *         description: "Create success"
 *       400:
 *         description: Bad request
 *       500:
 *        description: Lỗi không xác định
 *     security:
 *      - Bearer: []
 */
router.post('/', isAdmin, AdminUserController.create);

/**
 * @openapi
 * /a/users/{userId}:
 *   patch:
 *     tags:
 *      - "[ADMIN] USERS"
 *     summary: Cập nhật thông tin user
 *     description: Cập nhật thông tin user
 *     parameters:
 *      - in: "path"
 *        name: "userId"
 *        description: "User ID"
 *        required: true
 *        type: "integer"
 *      - in: "body"
 *        name: "body"
 *        description: "User object"
 *        required: true
 *        schema:
 *          type: "object"
 *          properties:
 *            fullName:
 *              type: "string"
 *            employeeCode:
 *              type: "string"
 *            departmentId:
 *              type: "integer"
 *            positionId:
 *              type: "integer"
 *            phoneNumber:
 *              type: "string"
 *            email:
 *              type: "string"
 *            address:
 *              type: "string"
 *            dateOfBirth:
 *              type: "string"
 *              format: "date"
 *            gender:
 *              type: "string"
 *              enum:
 *                - male
 *                - female
 *                - other
 *            status:
 *              type: "string"
 *              enum:
 *                - active
 *                - inactive
 *            role:
 *              type: "string"
 *              enum:
 *                - admin
 *                - user
 *                - manager
 *     responses:
 *       200:
 *         description: "Update success"
 *       400:
 *         description: Bad request
 *       404:
 *         description: User not found
 *       500:
 *        description: Lỗi không xác định
 *     security:
 *      - Bearer: []
 */
router.patch('/:userId', isAdmin, AdminUserController.update);

/**
  * @openapi
  * /a/users/{userId}/upload_avatar:
  *   patch:
  *     tags:
  *      - "[ADMIN] USERS"
  *     summary: Upload avatar cho user
  *     description: Upload avatar cho user
  *     consumes:
  *      - "multipart/form-data"
  *     produces:
  *      - "application/json"
  *     parameters:
  *      - in: "path"
  *        name: "userId"
  *        description: "User ID"
  *        required: true
  *        type: "integer"
  *      - in: "formData"
  *        name: "avatar"
  *        description: "Avatar file"
  *        required: true
  *        type: "file"
  *     responses:
  *       200:
  *         description: "Upload success"
  *       400:
  *         description: Bad request
  *       404:
  *         description: User not found
  *       500:
  *        description: Lỗi không xác định
  *     security:
  *      - Bearer: []
  */
router.patch('/:userId/upload_avatar', isAdmin, withoutSavingUploader.single('avatar'), AdminUserController.uploadAvatar);

/**
 * @openapi
 * /a/users/{userId}:
 *   delete:
 *     tags:
 *      - "[ADMIN] USERS"
 *     summary: Xóa user
 *     description: Xóa user
 *     parameters:
 *      - in: "path"
 *        name: "userId"
 *        description: "User ID"
 *        required: true
 *        type: "integer"
 *     responses:
 *       200:
 *         description: "Delete success"
 *       404:
 *         description: User not found
 *       500:
 *        description: Lỗi không xác định
 *     security:
 *      - Bearer: []
 */
router.delete('/:userId', isAdmin, AdminUserController.delete);

/**
 * @openapi
 * /a/users/{userId}:
 *   get:
 *     tags:
 *      - "[ADMIN] USERS"
 *     summary: Lấy thông tin user
 *     description: Lấy thông tin user
 *     parameters:
 *      - in: "path"
 *        name: "userId"
 *        description: "User ID"
 *        required: true
 *        type: "integer"
 *     responses:
 *       200:
 *         description: "Success"
 *       404:
 *         description: User not found
 *       500:
 *        description: Lỗi không xác định
 *     security:
 *      - Bearer: []
 */
router.get('/:userId', isAdmin, AdminUserController.show);

export default router;
