/** 获取json文件 */
export async function get<T>(url: string): Promise<T> {
  const res = await fetch(url)

  return res.json()
}
