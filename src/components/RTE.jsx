import React from 'react'
import { Editor } from '@tinymce/tinymce-react'
import { Controller } from 'react-hook-form'
import conf from '../conf/conf'

export default function RTE({ name, control, label, defaultValue = "" }) {
  const isMobile = typeof window !== 'undefined' && window.innerWidth < 640

  return (
    <div className='w-full'>
      {label && (
        <label className='inline-block mb-1 pl-1 text-sm sm:text-base'>
          {label}
        </label>
      )}

      <Controller
        name={name || "content"}
        control={control}
        render={({ field: { onChange } }) => (
          <Editor
            apiKey={conf.tinymceApiKey}
            initialValue={defaultValue}
            init={{
              height: isMobile ? 350 : 500,
              menubar: !isMobile,
              branding: false,
              resize: false,
              toolbar_mode: 'sliding',
              plugins: [
                "image",
                "advlist",
                "autolink",
                "lists",
                "link",
                "charmap",
                "preview",
                "anchor",
                "searchreplace",
                "visualblocks",
                "code",
                "fullscreen",
                "insertdatetime",
                "media",
                "table",
                "help",
                "wordcount",
              ],
              toolbar:
                "undo redo | blocks | table tableinsertdialog image | bold italic forecolor | alignleft aligncenter alignright alignjustify | bullist numlist outdent indent | removeformat | help",
              table_toolbar:
                "tableprops tabledelete | tableinsertrowbefore tableinsertrowafter tabledeleterow | tableinsertcolbefore tableinsertcolafter tabledeletecol",
              content_style:
                "body { font-family:Helvetica,Arial,sans-serif; font-size:14px }",
            }}
            onEditorChange={onChange}
          />
        )}
      />
    </div>
  )
}
