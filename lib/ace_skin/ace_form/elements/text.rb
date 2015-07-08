module AceSkin
  module AceForm
    module Elements
      class Text < Base

        def ext_html
          {'data-toggle' => :text, class: dom_class, type: :text}
        end

        def output
          content_tag(:textarea,  html) do
            value
          end
        end


      end
    end
  end
end
