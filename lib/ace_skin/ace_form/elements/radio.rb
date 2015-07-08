module AceSkin
  module AceForm
    module Elements
      class Radio < Base

        def ext_html
          {'data-toggle' => 'radio', type: :radio, class: dom_class}
        end

        def collection
          @options[:collection]
        end

        def option_output(opt_value, opt_label)
          content_tag :span, class: :radio do
            content_tag(:label, class: 'checkbox-inline') do
              [content_tag(:input, html.update({value: opt_value, checked: option_selected(opt_value), class: dom_class})) do
              end, content_tag(:span ,class: :lbl) do
                opt_label
              end].join(' ').html_safe
            end
          end
        end

        def option_selected(opt_value)
          (opt_value == real_value ? 'checked' : nil)
        end

        def real_value
          if required
            value || collection.keys.first
          else
            value
          end
        end

        def dom_class
          options[:html].try{|h| h[:class]}.blank? ? :ace : (options[:html][:class] << ' ace')
        end

        def output
          content_tag :div do
            collection.map{|opt_value, opt_label| option_output(opt_value, opt_label || opt_value.to_s)}.join(' ').html_safe
          end
        end

      end
    end
  end
end
