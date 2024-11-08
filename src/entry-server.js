import { renderToWebStream, renderToString } from 'vue/server-renderer'
import { createApp } from './main'

export async function render(url) {
  const { app, router } = createApp()
  await router.push(url)
  // passing SSR context object which will be available via useSSRContext()
  // @vitejs/plugin-vue injects code into a component's setup() that registers
  // itself on ctx.modules. After the render, ctx.modules would contain all the
  // components that have been instantiated during this render call.
  const ctx = {}
  // const stream = renderToWebStream(app, ctx)
  // if use stream, change to call synclonaze type render()
  const html = await renderToString(app, ctx)
  console.log(router)
  console.log('2')
  await console.log('url:', url, html)
  return { html }
}
