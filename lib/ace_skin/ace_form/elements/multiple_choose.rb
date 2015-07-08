module AceSkin
  module AceForm
    module Elements
      class MultipleChoose < Choose

        def dom_name
          "#{super}[]"
        end

        def ext_html
          {'data-toggle' => 'multiple_choose', 'multiple' => '', 'data-placeholder' => placeholder, class: dom_class}
        end

        def placeholder
          super || view_action('please_select_an_option')
        end

        def collection
          format_collection
        end

        def value
          super_value = super
          case super_value
            when String
              super_value.spilt(',')
            else
              super_value
          end
        end

        def option_selected(opt_value)
          (real_value.include?(opt_value.to_s)) ? 'selected' : nil if real_value
        end

      end
    end
  end
end
