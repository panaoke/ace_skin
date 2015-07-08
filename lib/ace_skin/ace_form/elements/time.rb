module AceSkin
  module AceForm
    module Elements
      class Time < Base
        def ext_html
          {'data-toggle' => 'time', type: :text, class: 'ace-input'}
        end

        def validation
          val = super
          (val || '').split(';').push('time').join('')
        end

        def output
          content_tag :div, class: 'bootstrap-timepicker' do
            super
          end
        end

      end
    end
  end
end
