// Возвращает новый массив с элементом, перемещённым с fromIndex на toIndex.
// Если индексы некорректны или совпадают — возвращает исходный массив.
export const reorder = <T>(items: T[], fromIndex: number, toIndex: number): T[] => {
  if (
    fromIndex === toIndex ||
    fromIndex < 0 ||
    toIndex < 0 ||
    fromIndex >= items.length ||
    toIndex >= items.length
  ) {
    return items;
  }

  const next = [...items];
  const [moved] = next.splice(fromIndex, 1);
  next.splice(toIndex, 0, moved);

  return next;
};
