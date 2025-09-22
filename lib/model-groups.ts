import models from "@/data/models"

export type ModelGroupType = "coding" | "free" | "multimodal"

export interface ModelGroup {
  name: string
  models: typeof models
  description: string
  priority: number
}

export function groupModelsByType(type: ModelGroupType): ModelGroup {
  switch (type) {
    case "coding":
      return {
        name: "Coding",
        description: "Specialized for programming and development",
        priority: 6,
        models: getCodingModels(),
      }

    case "free":
      return {
        name: "Free",
        description: "Free to use models",
        priority: 4,
        models: getFreeModels(),
      }

    case "multimodal":
      return {
        name: "Multimodal",
        description: "Models that support images and other media",
        priority: 5,
        models: getMultimodalModels(),
      }

    default:
      return {
        name: "All",
        description: "All available models",
        priority: 999,
        models: models,
      }
  }
}

function getCodingModels(): typeof models {
  return models
    .filter((model) => {
      const name = model.name.toLowerCase()
      const description = model.description.toLowerCase()

      // Look for coding-related keywords
      const codingKeywords = [
        "code",
        "coder",
        "coding",
        "programming",
        "developer",
        "software",
        "agent",
        "tool",
        "function",
        "api",
        "development",
        "engineer",
      ]

      return codingKeywords.some(
        (keyword) => name.includes(keyword) || description.includes(keyword),
      )
    })
    .sort((a, b) => {
      // Sort by how many coding keywords match
      const getScore = (model: (typeof models)[0]) => {
        const text = `${model.name} ${model.description}`.toLowerCase()
        const keywords = [
          "code",
          "coder",
          "coding",
          "programming",
          "developer",
          "software",
          "agent",
          "tool",
        ]
        return keywords.filter((k) => text.includes(k)).length
      }

      return getScore(b) - getScore(a)
    })
}

function getFreeModels(): typeof models {
  return models.filter(
    (m) => parseFloat(m.pricing.prompt) === 0 && parseFloat(m.pricing.completion) === 0,
  )
}

function getCodingModels(): typeof models {
  return models
    .filter((model) => {
      const name = model.name.toLowerCase()
      const description = model.description.toLowerCase()

      // Look for coding-related keywords
      const codingKeywords = [
        "code",
        "coder",
        "coding",
        "programming",
        "developer",
        "software",
        "agent",
        "tool",
        "function",
        "api",
        "development",
        "engineer",
      ]

      return codingKeywords.some(
        (keyword) => name.includes(keyword) || description.includes(keyword),
      )
    })
    .sort((a, b) => {
      // Sort by how many coding keywords match
      const getScore = (model: (typeof models)[0]) => {
        const text = `${model.name} ${model.description}`.toLowerCase()
        const keywords = [
          "code",
          "coder",
          "coding",
          "programming",
          "developer",
          "software",
          "agent",
          "tool",
        ]
        return keywords.filter((k) => text.includes(k)).length
      }

      return getScore(b) - getScore(a)
    })
}

function getFreeModels(): typeof models {
  return models.filter(
    (m) => parseFloat(m.pricing.prompt) === 0 && parseFloat(m.pricing.completion) === 0,
  )
}

function getMultimodalModels(): typeof models {
  return models
    .filter((model) => model.architecture.input_modalities.length > 1)
    .sort((a, b) => {
      // Sort by number of input modalities, then by context length
      const aModalities = a.architecture.input_modalities.length
      const bModalities = b.architecture.input_modalities.length

      if (aModalities !== bModalities) return bModalities - aModalities
      return b.context_length - a.context_length
    })
}

export function getAllModelGroups(): ModelGroup[] {
  // Simple categories as requested: Auto, Coding, Free, Multimodal
  const simpleGroups: ModelGroupType[] = ["coding", "free", "multimodal"]

  return simpleGroups
    .map((type) => groupModelsByType(type))
    .sort((a, b) => a.priority - b.priority)
}
