module AceSkin
  module AceForm
    module Elements
      class Calculate < Base

        def ext_html
          {'data-toggle' => 'calculate', type: :hidden, 'data-formula' => formula, 'data-value-format' => value_format,
           class: 'ace-input'}
        end

        def value_format
          @options[:value_format] || 'integer'
        end

        def formula
          @options[:formula].try{|str| str.gsub('.', '_')}
        end

        def output
          content_tag(:div,  html)do
            super <<  content_tag(:label) do
              value
            end
          end
        end

      end
    end
  end
end
