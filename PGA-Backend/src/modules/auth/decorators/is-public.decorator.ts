import { SetMetadata } from '@nestjs/common';

export const IS_PUBLIC_KEY = 'isPublic';

/**
 * Marca uma rota como pública, removendo a necessidade de autenticação JWT.
 * Utilizado em combinação com o JwtAuthGuard global.
 * 
 * @example
 * ```typescript
 * @Public()
 * @Get('endpoint')
 * async publicEndpoint() {
 *   return { message: 'Este endpoint é público' };
 * }
 * ```
 */
export const Public = () => SetMetadata(IS_PUBLIC_KEY, true);