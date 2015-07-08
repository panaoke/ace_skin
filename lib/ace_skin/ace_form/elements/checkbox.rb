module AceSkin
  module AceForm
    module Elements
      class CheckBox < Radio

        def ext_html
          {'data-toggle' => 'radio', type: :checkbox, class: 'ace-input'}
        end

        def name
          "#{super}[]"
        end

      end
    end
  end
end
