module AceSkin
  module AceForm
    module Elements
      class Date < Base

        def ext_html
          {'data-toggle' => :date, class: 'ace-input'}
        end

        def validation
          val = super
          (val || '').split(',').push('date').join(',')
        end

      end
    end
  end
end
