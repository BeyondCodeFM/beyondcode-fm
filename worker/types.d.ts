interface Env {
  ASSETS: { fetch(request: Request): Promise<Response> }
}

interface WorkerHandler<E> {
  fetch(request: Request, env: E): Response | Promise<Response>
}
