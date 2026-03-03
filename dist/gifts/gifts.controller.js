"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.GiftsController = void 0;
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const gifts_service_1 = require("./gifts.service");
const gift_response_dto_1 = require("./dto/gift-response.dto");
let GiftsController = class GiftsController {
    constructor(giftsService) {
        this.giftsService = giftsService;
    }
    findAll() {
        return this.giftsService.findAll();
    }
    findOne(id) {
        return this.giftsService.findOne(id);
    }
};
exports.GiftsController = GiftsController;
__decorate([
    (0, common_1.Get)(),
    (0, swagger_1.ApiOperation)({ summary: 'Lista todos os presentes' }),
    (0, swagger_1.ApiResponse)({ status: 200, type: [gift_response_dto_1.GiftResponseDto] }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], GiftsController.prototype, "findAll", null);
__decorate([
    (0, common_1.Get)(':id'),
    (0, swagger_1.ApiOperation)({ summary: 'Detalhe de um presente' }),
    (0, swagger_1.ApiResponse)({ status: 200, type: gift_response_dto_1.GiftResponseDto }),
    (0, swagger_1.ApiResponse)({ status: 404, description: 'Presente não encontrado' }),
    __param(0, (0, common_1.Param)('id', common_1.ParseIntPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", void 0)
], GiftsController.prototype, "findOne", null);
exports.GiftsController = GiftsController = __decorate([
    (0, swagger_1.ApiTags)('Gifts'),
    (0, common_1.Controller)('gifts'),
    __metadata("design:paramtypes", [gifts_service_1.GiftsService])
], GiftsController);
//# sourceMappingURL=gifts.controller.js.map