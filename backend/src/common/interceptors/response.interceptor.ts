import { Injectable, NestInterceptor, ExecutionContext, CallHandler } from '@nestjs/common';
import { Observable, map } from 'rxjs';

export interface ApiResponse<T> {
  success: boolean;
  data: T;
  meta?: {
    page?: number;
    limit?: number;
    total?: number;
    totalPages?: number;
  };
}

@Injectable()
export class ResponseInterceptor<T> implements NestInterceptor<T, ApiResponse<T>> {
  intercept(context: ExecutionContext, next: CallHandler): Observable<ApiResponse<T>> {
    return next.handle().pipe(
      map((data) => {
        if (data && typeof data === 'object' && data._isPaginated) {
          // eslint-disable-next-line @typescript-eslint/no-unused-vars
          const { _isPaginated, _meta, ...rest } = data;
          return {
            success: true,
            data: rest,
            meta: _meta,
          };
        }

        return {
          success: true,
          data,
        };
      }),
    );
  }
}
