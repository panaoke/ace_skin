module AceSkin
  module AceForm
    module Elements
      class ShopSelect < Base

        def ext_html
          {'data-toggle' => 'shop_select', 'type' => 'text', 'data-max-size' => max_size, }
        end

        def max_size
          options[:max_size] || 100000
        end

      end
    end
  end
end
