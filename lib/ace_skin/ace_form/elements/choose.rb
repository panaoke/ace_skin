module AceSkin
  module AceForm
    module Elements
      class Choose < Base

        def ext_html
          {'data-toggle' => :choose, class: 'ace-input'}
        end

        def format_collection
          if col = @options[:collection]
             (col.is_a?(Array) && col[0].is_a?(Array) ? Hash[col] : col)
          else
            {}
          end
        end

        def collection
          if required
            format_collection
          else
            {'' => view_action('nil')}.update(format_collection)
          end
        end

        def option_output(opt_value, opt_label)
          content_tag(:option, {'value' => opt_value, 'selected' => option_selected(opt_value)}) do
            opt_label
          end
        end

        def option_selected(opt_value)
          (opt_value.to_s == real_value.to_s ? 'selected' : nil)
        end

        def real_value
          if value.blank? && options.keys.include?(:default_value)
            options[:default_value]
          elsif required
            value || collection.keys.first
          else
            value.blank? ? '' : value
          end
        end

        def output
          content_tag(:select,  html)do
            collection.map{|opt_value, opt_label| option_output(opt_value, opt_label || opt_value)}.join(' ').html_safe
          end
        end

      end
    end
  end
end
