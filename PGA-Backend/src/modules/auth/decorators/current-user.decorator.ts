import { createParamDecorator, ExecutionContext } from '@nestjs/common';

/**
 * Decorator que extrai o usuário atual do objeto de requisição.
 * Pode ser usado para acessar facilmente os dados do usuário autenticado em controladores.
 * 
 * @example
 * ```typescript
 * @Get('perfil')
 * getProfile(@CurrentUser() user) {
 *   return user;
 * }
 * ```
 */
export const CurrentUser = createParamDecorator(
  (data: unknown, ctx: ExecutionContext) => {
    const request = ctx.switchToHttp().getRequest();
    return request.user;
  },
); 