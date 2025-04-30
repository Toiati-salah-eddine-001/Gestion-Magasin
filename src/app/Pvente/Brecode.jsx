import React from 'react'

function Brecode() {
  return (
    <div className="mt-8">
    <h2 className="text-lg font-semibold mb-2">قارئ الباركود</h2>
    <div id="reader" className="border p-4 rounded bg-white shadow-md" />
    {dataScaner && (
      <div className="mt-2">
        <p className="text-sm text-green-600">
          تم قراءة الباركود: <strong>{dataScaner}</strong>
        </p>
        <Button onClick={resetScanner} variant="outline" className="mt-2">
          مسح منتج آخر
        </Button>
      </div>
    )}
  </div>
  )
}

export default Brecode