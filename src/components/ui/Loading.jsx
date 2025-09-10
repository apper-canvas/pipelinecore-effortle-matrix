import React from "react"

const Loading = ({ type = "card", count = 6 }) => {
  if (type === "table") {
    return (
      <div className="bg-white rounded-xl shadow-soft overflow-hidden">
        <div className="p-6 border-b border-slate-200">
          <div className="h-6 bg-slate-200 rounded w-32 animate-pulse"></div>
        </div>
        <div className="divide-y divide-slate-200">
          {Array.from({ length: count }).map((_, i) => (
            <div key={i} className="p-4 space-y-3">
              <div className="flex items-center gap-4">
                <div className="h-10 w-10 bg-slate-200 rounded-full animate-pulse"></div>
                <div className="flex-1 space-y-2">
                  <div className="h-4 bg-slate-200 rounded w-3/4 animate-pulse"></div>
                  <div className="h-3 bg-slate-200 rounded w-1/2 animate-pulse"></div>
                </div>
                <div className="h-6 bg-slate-200 rounded w-16 animate-pulse"></div>
              </div>
            </div>
          ))}
        </div>
      </div>
    )
  }

  if (type === "metrics") {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className="bg-white rounded-xl p-6 shadow-soft">
            <div className="flex items-center justify-between">
              <div className="flex-1 space-y-3">
                <div className="h-4 bg-slate-200 rounded w-20 animate-pulse"></div>
                <div className="h-8 bg-slate-200 rounded w-16 animate-pulse"></div>
                <div className="h-3 bg-slate-200 rounded w-12 animate-pulse"></div>
              </div>
              <div className="h-12 w-12 bg-slate-200 rounded-xl animate-pulse"></div>
            </div>
          </div>
        ))}
      </div>
    )
  }

  if (type === "pipeline") {
    return (
      <div className="grid grid-cols-1 lg:grid-cols-6 gap-6">
        {Array.from({ length: 6 }).map((_, stageIndex) => (
          <div key={stageIndex} className="space-y-4">
            <div className="h-6 bg-slate-200 rounded w-24 animate-pulse"></div>
            {Array.from({ length: 3 }).map((_, cardIndex) => (
              <div key={cardIndex} className="bg-white rounded-xl p-4 shadow-soft space-y-3">
                <div className="flex items-start justify-between">
                  <div className="flex-1 space-y-2">
                    <div className="h-4 bg-slate-200 rounded w-3/4 animate-pulse"></div>
                    <div className="h-3 bg-slate-200 rounded w-1/2 animate-pulse"></div>
                  </div>
                </div>
                <div className="h-5 bg-slate-200 rounded w-16 animate-pulse"></div>
                <div className="flex justify-between items-center">
                  <div className="h-5 bg-slate-200 rounded w-20 animate-pulse"></div>
                  <div className="h-4 bg-slate-200 rounded w-10 animate-pulse"></div>
                </div>
              </div>
            ))}
          </div>
        ))}
      </div>
    )
  }

  return (
    <div className="grid grid-cols-1 gap-6">
      {Array.from({ length: count }).map((_, i) => (
        <div key={i} className="bg-white rounded-xl p-6 shadow-soft space-y-4">
          <div className="flex items-center gap-4">
            <div className="h-12 w-12 bg-slate-200 rounded-full animate-pulse"></div>
            <div className="flex-1 space-y-2">
              <div className="h-5 bg-slate-200 rounded w-1/3 animate-pulse"></div>
              <div className="h-4 bg-slate-200 rounded w-1/2 animate-pulse"></div>
            </div>
          </div>
          <div className="space-y-3">
            <div className="h-4 bg-slate-200 rounded w-full animate-pulse"></div>
            <div className="h-4 bg-slate-200 rounded w-3/4 animate-pulse"></div>
            <div className="h-4 bg-slate-200 rounded w-1/2 animate-pulse"></div>
          </div>
        </div>
      ))}
    </div>
  )
}

export default Loading