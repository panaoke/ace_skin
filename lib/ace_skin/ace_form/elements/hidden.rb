module AceSkin
  module AceForm
    module Elements
      class Hidden < Base

        def ext_html
          {'data-toggle' => 'string', type: :hidden, class: 'ace-input'}
        end

        def template
          :none
        end

      end
    end
  end
end
