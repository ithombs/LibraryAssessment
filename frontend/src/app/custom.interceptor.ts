import { HttpInterceptorFn } from '@angular/common/http';

export const customInterceptor: HttpInterceptorFn = (req, next) => {
  const token = localStorage.getItem("jwt");
  const cloneRequest = req.clone({
    setHeaders:{
      Authorization: `Bearer ${token}`
    }
  });
  return next(cloneRequest);
};
