module AceSkin
  module AceForm
    module Elements
      class Photo < Base

        def ext_html
          {'data-toggle' => 'photo', type: :hidden, class: dom_class}
        end

      end
    end
  end
end
