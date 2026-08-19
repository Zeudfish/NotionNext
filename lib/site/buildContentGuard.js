import BLOG from '@/blog.config'
import getAllPageIds from '@/lib/db/notion/getAllPageIds'
import getPageProperties from '@/lib/db/notion/getPageProperties'
import {
  fetchInBatches,
  fetchNotionPageBlocks
} from '@/lib/db/notion/getPostBlocks'
import {
  normalizeCollection,
  normalizeNotionMetadata,
  normalizePageBlock,
  normalizeSchema
} from '@/lib/db/notion/normalizeUtil'
import { adapterNotionBlockMap } from '@/lib/utils/notion.util'
import { extractLangId } from '@/lib/utils/pageId'
import {
  formatContentValidationReport,
  validateContentRows
} from '@/lib/site/contentValidation'
import { idToUuid } from 'notion-utils'

const validationPromises = new Map()

const getSchemaOptions = (schema, propertyName) => {
  const property = Object.values(schema || {}).find(
    item => item?.name === propertyName
  )
  return (property?.options || [])
    .map(option => option?.value || option?.name || option)
    .filter(Boolean)
}

async function loadRowsFromNotion(pageId, from) {
  const databasePageId = idToUuid(pageId)
  const pageRecordMap = await fetchNotionPageBlocks(pageId, from)
  if (!pageRecordMap) {
    throw new Error(`无法读取 Notion 数据库：${pageId}`)
  }

  let block = adapterNotionBlockMap({
    block: pageRecordMap.block || {}
  }).block
  const rawMetadata = normalizeNotionMetadata(block, databasePageId)
  const collectionMap = pageRecordMap.collection || {}
  const inferredCollectionId =
    Object.keys(collectionMap).length === 1 ? Object.keys(collectionMap)[0] : null
  const collectionId = rawMetadata?.collection_id || inferredCollectionId

  if (!collectionId) {
    throw new Error(`Notion 页面不是可校验的数据库：${pageId}`)
  }

  const collection = normalizeCollection(
    collectionMap?.[collectionId] ||
      collectionMap?.[idToUuid(collectionId)] ||
      {}
  )
  const schema = normalizeSchema(collection?.schema || {})
  const collectionQuery = pageRecordMap.collection_query
  const collectionView = pageRecordMap.collection_view
  const viewIds = rawMetadata?.view_ids
  const pageIds = getAllPageIds(
    collectionQuery,
    collectionId,
    collectionView,
    viewIds,
    block
  )
  const missingBlockIds = pageIds.filter(id => !normalizePageBlock(block[id]))

  if (missingBlockIds.length > 0) {
    const fetchedBlocks = await fetchInBatches(missingBlockIds)
    const adaptedBlocks = adapterNotionBlockMap({
      block: fetchedBlocks
    }).block
    block = { ...block, ...adaptedBlocks }
  }

  const rows = []
  for (const id of pageIds) {
    const pageBlock = normalizePageBlock(block[id])
    if (!pageBlock || pageBlock.parent_id !== collectionId) continue

    const properties = await getPageProperties(id, pageBlock, schema, null, [])
    if (properties) rows.push(properties)
  }

  return {
    rows,
    allowedCategories: getSchemaOptions(schema, 'category')
  }
}

async function runValidation({ pageId, from }) {
  const siteIds = String(pageId || BLOG.NOTION_PAGE_ID)
    .split(',')
    .map(extractLangId)
    .filter(Boolean)
  const aggregate = { errors: [], warnings: [] }

  for (const siteId of siteIds) {
    const { rows, allowedCategories } = await loadRowsFromNotion(siteId, from)
    const result = validateContentRows(rows, { allowedCategories })
    aggregate.errors.push(...result.errors.map(error => `[${siteId}] ${error}`))
    aggregate.warnings.push(
      ...result.warnings.map(warning => `[${siteId}] ${warning}`)
    )
  }

  aggregate.warnings.forEach(warning => {
    console.warn(`[content-validation] ${warning}`)
  })

  if (aggregate.errors.length > 0) {
    throw new Error(formatContentValidationReport(aggregate))
  }

  console.log('[content-validation] Notion 发布数据校验通过')
}

export function assertBuildContentIsValid({
  pageId = BLOG.NOTION_PAGE_ID,
  from = 'build-content-validation'
} = {}) {
  if (
    process.env.NODE_ENV !== 'production' &&
    process.env.VALIDATE_NOTION_DATA !== 'true'
  ) {
    return Promise.resolve()
  }

  const key = String(pageId)
  if (!validationPromises.has(key)) {
    const promise = runValidation({ pageId, from })
    promise.catch(() => validationPromises.delete(key))
    validationPromises.set(key, promise)
  }

  return validationPromises.get(key)
}
