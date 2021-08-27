import { GetStateCategory } from 'procon-ip/lib/get-state-data'

export interface LayoutItem {
  category: GetStateCategory
  index: number
}

export interface LayoutGroup {
  items: Array<LayoutItem>
}

export class Layout {
  big = new Array<LayoutItem>()
  small = new Array<LayoutItem>()
  blocks = new Array<LayoutGroup>()
}

export function LayoutToString(layout: Layout): string {
  return JSON.stringify(layout)
}

export function StringToLayout(layout: string): Layout {
  return JSON.parse(layout)
}

export const DefaultLayout = new Layout();
[0,1].forEach(i => DefaultLayout.big.push({ category: GetStateCategory.TEMPERATURES, index: i}));
[0,1].forEach(i => DefaultLayout.small.push({ category: GetStateCategory.TEMPERATURES, index: i}));
[0,1,2].forEach(i => DefaultLayout.blocks.push({items: []}));
[0,1,2,3,4,5,6,7].forEach(i => DefaultLayout.blocks[0].items.push({ category: GetStateCategory.TEMPERATURES, index: i}));
[0,1].forEach(i => DefaultLayout.blocks[0].items.push({ category: GetStateCategory.ELECTRODES, index: i}));
[0,1,2,3].forEach(i => DefaultLayout.blocks[0].items.push({ category: GetStateCategory.ANALOG, index: i}));
[0,1,2,3,4,5,6,7].forEach(i => DefaultLayout.blocks[0].items.push({ category: GetStateCategory.RELAYS, index: i}))

const defaultLayout2: Layout = {
  big: [
    { category: GetStateCategory.TEMPERATURES, index: 0},
    { category: GetStateCategory.TEMPERATURES, index: 0},
  ],
  small: [
    { category: GetStateCategory.TEMPERATURES, index: 0},
    { category: GetStateCategory.TEMPERATURES, index: 0},
  ],
  blocks: [
    {
      items: [
        { category: GetStateCategory.TEMPERATURES, index: 0},
        { category: GetStateCategory.TEMPERATURES, index: 1},
        { category: GetStateCategory.TEMPERATURES, index: 2},
        { category: GetStateCategory.TEMPERATURES, index: 3},
        { category: GetStateCategory.TEMPERATURES, index: 4},
        { category: GetStateCategory.TEMPERATURES, index: 5},
        { category: GetStateCategory.TEMPERATURES, index: 6},
        { category: GetStateCategory.TEMPERATURES, index: 7},
      ]
    }, {
      items: [
        { category: GetStateCategory.ELECTRODES, index: 0},
        { category: GetStateCategory.ELECTRODES, index: 1},
        { category: GetStateCategory.ANALOG, index: 0},
        { category: GetStateCategory.ANALOG, index: 1},
        { category: GetStateCategory.ANALOG, index: 2},
        { category: GetStateCategory.ANALOG, index: 3},
      ]
    }, {
      items: [
        { category: GetStateCategory.RELAYS, index: 0},
        { category: GetStateCategory.RELAYS, index: 1},
        { category: GetStateCategory.RELAYS, index: 2},
        { category: GetStateCategory.RELAYS, index: 3},
        { category: GetStateCategory.RELAYS, index: 4},
        { category: GetStateCategory.RELAYS, index: 5},
        { category: GetStateCategory.RELAYS, index: 6},
        { category: GetStateCategory.RELAYS, index: 7},
      ]
    }
  ],
}
